import PlayerInList from '@/components/players/PlayerInList';
import { useRosterDownload } from '@/hooks/usePlayers';
import { useRoster } from '@/hooks/useRosters';
import { Player } from '@/types/FullTypes';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RosterDetailScreenProps {
  rosterId: string;
  onBack: () => void;
}

const RosterDetailScreen: React.FC<RosterDetailScreenProps> = ({ rosterId, onBack }) => {
  const router = useRouter();
  const { roster, loading, error } = useRoster(rosterId);
  const { download, downloading } = useRosterDownload();
  




  const handlePlayerPress = (playerId: string) => {
    console.log('Player pressed:', playerId);
    router.push(`/playerDetails?playerId=${playerId}`);
  };





  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerInList
      player={item}
      onPlayerPress={(playerId) => handlePlayerPress(playerId)}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading roster...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Rosters</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!roster) {
    return (
      <View style={styles.centered}>
        <Text>Roster not found</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Rosters</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{roster.name}</Text>
        <TouchableOpacity 
          onPress={() => download(rosterId)} 
          style={styles.downloadButton}
          disabled={downloading}
        >
          <Text style={styles.downloadButtonText}>
            {downloading ? 'Downloading...' : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {roster.players?.length || 0} players
      </Text>
      
      <FlatList
        data={roster.players || []}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default RosterDetailScreen;