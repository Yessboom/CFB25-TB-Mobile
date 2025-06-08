import { useRosters } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes'; // Adjust path to your types file
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RosterListScreen = () => {
  const { rosters, loading, error, deleteRoster, updateRoster } = useRosters();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (rosterId: string, rosterName: string) => {
    console.log(`Deleting roster: ${rosterId} - ${rosterName}`);
    Alert.alert(
      'Delete Roster',
      `Are you sure you want to delete "${rosterName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRoster(rosterId);
              Alert.alert('Success', 'Roster deleted successfully');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete roster');
            }
          }
        }
      ]
    );
  };

  const handleUpdate = async (rosterId: string, newName: string) => {
    try {
      await updateRoster(rosterId, newName);
      setEditingId(null);
      Alert.alert('Success', 'Roster updated successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update roster');
    }
  };

  const renderRoster = ({ item }: { item: Roster }) => (
    <View style={styles.rosterItem}>
      <View style={styles.rosterInfo}>
        <Text style={styles.rosterName}>{item.name || 'Unnamed Roster'}</Text>
        <Text style={styles.playerCount}>{item.players.length} players</Text>
        <Text style={styles.playerCount}> {item.rosterId} roster id</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditingId(item.rosterId)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.rosterId, item.name || 'Unnamed Roster')}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading rosters...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rosters</Text>
    <TouchableOpacity
      style={{ backgroundColor: 'green', padding: 10, marginBottom: 10 }}
      onPress={() => {
        console.log('🧪 Test button pressed');
        Alert.alert('Test', 'Alert is working!');
      }}
    >
      <Text style={{ color: 'white' }}>🧪 Test Alert</Text>
    </TouchableOpacity>      
      <FlatList
        data={rosters}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderRoster}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  rosterItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  rosterInfo: {
    flex: 1,
  },
  templateInfo: {
    flex: 1,
  },
  rosterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateCreator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
  },
});

export default RosterListScreen;