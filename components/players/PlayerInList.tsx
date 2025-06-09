import ImageViewer from '@/components/ImageViewer';
import { getPositionName, getSkillBackgroundColor, getSkillValueColor } from '@/helpers/format';
import { getOverall } from '@/helpers/OverallCalculator';
import { Player } from '@/types/FullTypes';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImpactPlayer from './ImpactPlayer';

interface PlayerInListProps {
  player: Player;
  onPlayerPress?: (playerId: string) => void;
}

const PlayerInList: React.FC<PlayerInListProps> = ({ 
  player, 
  onPlayerPress 
}) => {
  const router = useRouter();

  const handlePlayerPress = () => {
    if (onPlayerPress) {
      // Pass player.id instead of player.playerId
      onPlayerPress(player.id);
    } else {
      // Default navigation using player.id
      router.push(`/playerDetails?playerId=${player.id}`);
    }
  };

  const renderSkillItem = (skillName: string, skillValue: number) => (
    <TouchableOpacity 
      key={skillName}
      style={[styles.skillItem, { backgroundColor: getSkillBackgroundColor(skillValue) }]}
    >
      <Text style={[styles.skillName, { color: getSkillValueColor(skillValue) }]}>
        {skillName}
      </Text>
      <Text style={[styles.skillValue, { color: getSkillValueColor(skillValue) }]}>
        {skillValue}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.playerCard}>
      {/* Player Header - Clickable */}
      <TouchableOpacity style={styles.playerHeader} onPress={handlePlayerPress}>
        <View style={styles.nameAndImage}>
          <View style={styles.playerInfo}>
            <View style={styles.nameAndImpact}>
              <Text style={styles.playerName}>
                {player.firstName} {player.lastName || 'Unnamed Player'}
              </Text>
              <ImpactPlayer isImpact={player.isImpactPlayer} />
            </View>
            <Text style={styles.playerSubtitle}>
              {getPositionName(player.position)} • Overall: {getOverall(player) || 'N/A'}
            </Text>
            <Text style={styles.playerId}>ID: {player.id}</Text> {/* Display player.id */}
          </View>
          
          {player.portraitImage && (
            <ImageViewer
              imgSource={player.portraitImage}
              style={styles.playerImage}
              showPlaceholder={false}
            />
          )}
        </View>
        <Text style={styles.tapHint}>Tap for details →</Text>
      </TouchableOpacity>
      
      {/* Basic Info */}
      <View style={styles.playerBasicInfo}>
        <TouchableOpacity 
          style={styles.infoItem}
        >
          <Text style={styles.infoLabel}>Position:</Text>
          <Text style={styles.infoValue}>{getPositionName(player.position)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoItem}
        >
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{player.age || 'N/A'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoItem}
        >
          <Text style={styles.infoLabel}>Jersey #:</Text>
          <Text style={styles.infoValue}>{player.jerseyNumber || 'N/A'}</Text>
        </TouchableOpacity>


      </View>
      
      {/* Key Skills Section */}
      <View style={styles.skillsSection}>
        <Text style={styles.skillsTitle}>Key Skills:</Text>
        <View style={styles.skillsGrid}>
          {player.speed !== undefined && renderSkillItem('Speed', player.speed)}
          {player.acceleration !== undefined && renderSkillItem('Acceleration', player.acceleration)}
          {player.agility !== undefined && renderSkillItem('Agility', player.agility)}
          {player.strength !== undefined && renderSkillItem('Strength', player.strength)}
          {player.awareness !== undefined && renderSkillItem('Awareness', player.awareness)}
          {player.catching !== undefined && renderSkillItem('Catching', player.catching)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  playerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  playerId: {
    fontSize: 12,
    color: '#888',
  },
  playerBasicInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 4,
    borderRadius: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  skillsSection: {
    marginTop: 8,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillName: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameAndImage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameAndImpact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  tapHint: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default PlayerInList;