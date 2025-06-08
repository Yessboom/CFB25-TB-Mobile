import { getPositionName, getSkillBackgroundColor, getSkillValueColor } from '@/helpers/format';
import { getOverall } from '@/helpers/OverallCalculator';
import { Player } from '@/types/FullTypes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from '../ImageViewer';
import ImpactPlayer from './ImpactPlayer';

interface PlayerInListProps {
  player: Player;
  onEditField?: (playerId: string, field: string, currentValue: string | number, type: 'basic' | 'skill') => void;
  onPlayerPress?: (playerId: string) => void;
}

const PlayerInList: React.FC<PlayerInListProps> = ({ 
  player, 
  onEditField, 
  onPlayerPress 
}) => {
  
  const renderSkillItem = (skillName: string, skillValue: number) => (
    <TouchableOpacity 
      key={skillName}
      style={[styles.skillItem, { backgroundColor: getSkillBackgroundColor(skillValue) }]}
      onPress={() => onEditField?.(player.playerId, skillName.toLowerCase(), skillValue, 'skill')}
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
      {/* Player Header */}
      <View style={styles.playerHeader}>
        <TouchableOpacity onPress={() => onPlayerPress?.(player.playerId)}>
          <Text style={styles.playerName}>
            {player.firstName} {player.lastName || 'Unnamed Player'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.playerSubtitle}>
          {getPositionName(player.position)} • Overall: {getOverall(player) || 'N/A'}
        </Text>
        <Text style={styles.playerId}>ID: {player.playerId}</Text>
      </View>
      
      {/* Basic Info */}
      <View style={styles.playerBasicInfo}>
        <TouchableOpacity 
          style={styles.infoItem}
          onPress={() => onEditField?.(player.playerId, 'position', player.position || '', 'basic')}
        >
          <Text style={styles.infoLabel}>Position:</Text>
          <Text style={styles.infoValue}>{getPositionName(player.position)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoItem}
          onPress={() => onEditField?.(player.playerId, 'age', player.age || 0, 'basic')}
        >
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{player.age || 'N/A'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoItem}
          onPress={() => onEditField?.(player.playerId, 'jerseyNumber', player.jerseyNumber || 0, 'basic')}
        >
          <Text style={styles.infoLabel}>Jersey #:</Text>
          <Text style={styles.infoValue}>{player.jerseyNumber || 'N/A'}</Text>
        </TouchableOpacity>

        <ImpactPlayer
        isImpact = {player.isImpactPlayer}
        />

        <TouchableOpacity 
          style={styles.infoItem}
        >
          <Text style={styles.infoLabel}>PlayerImage #:</Text>
          <Text style={styles.infoValue}>{player.portraitImage || 'N/A'}</Text>
        </TouchableOpacity>
        <ImageViewer
            imgSource={player.portraitImage}
            style={{ width: 100, height: 100, borderRadius: 8, marginTop: 8 }}

        />

        

        

      </View>
      
      {/* Skills Section */}
      <View style={styles.skillsSection}>
        <Text style={styles.skillsTitle}>Skills:</Text>
        <View style={styles.skillsGrid}>
          {getOverall(player) !== undefined && 
            renderSkillItem('Overall', getOverall(player))}
          {player.speed !== undefined && 
            renderSkillItem('Speed', player.speed)}
          {player.acceleration !== undefined && 
            renderSkillItem('Acceleration', player.acceleration)}
          {player.agility !== undefined && 
            renderSkillItem('Agility', player.agility)}
          {player.strength !== undefined && 
            renderSkillItem('Strength', player.strength)}
          {player.awareness !== undefined && 
            renderSkillItem('Awareness', player.awareness)}
          {player.catching !== undefined && 
            renderSkillItem('Catching', player.catching)}
          {player.carrying !== undefined && 
            renderSkillItem('Carrying', player.carrying)}
          {player.trucking !== undefined && 
            renderSkillItem('Trucking', player.trucking)}
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
});

export default PlayerInList;