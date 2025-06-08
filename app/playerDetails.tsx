import PlayerDetails from '@/components/players/playerDetails';
import { usePlayer } from '@/hooks/usePlayers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PlayerDetailsPage = () => {
  const { playerId } = useLocalSearchParams<{ playerId: string }>();
  const router = useRouter();
  const { player, loading, error, refetch } = usePlayer(playerId || '');

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading player...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity onPress={refetch} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.centered}>
        <Text>Player not found</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PlayerDetails 
      player={player} 
      onBack={handleBack}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default PlayerDetailsPage;