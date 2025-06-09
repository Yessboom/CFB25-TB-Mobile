import PlayerInList from '@/components/players/PlayerInList'; // Import the component
import { usePlayerUpdate, useRosterDownload } from '@/hooks/usePlayers';
import { useRoster } from '@/hooks/useRosters';
import { Player } from '@/types/FullTypes';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RosterDetailScreenProps {
  rosterId: string;
  onBack: () => void;
}

const RosterDetailScreen: React.FC<RosterDetailScreenProps> = ({ rosterId, onBack }) => {
  const router = useRouter();
  const { roster, loading, error } = useRoster(rosterId);
  const { updateBasicInfo, updateSkill, loading: updateLoading } = usePlayerUpdate();
  const { download, downloading } = useRosterDownload();
  
  // Modal states for editing
  const [editingPlayer, setEditingPlayer] = useState<{
    playerId: string;
    field: string;
    currentValue: string | number;
    type: 'basic' | 'skill';
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Success/Error modals
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showSuccess = (message: string) => {
    setModalMessage(message);
    setSuccessModalVisible(true);
    setTimeout(() => setSuccessModalVisible(false), 2000);
  };

  const showError = (message: string) => {
    setModalMessage(message);
    setErrorModalVisible(true);
  };

  const handleEditField = (playerId: string, field: string, currentValue: string | number, type: 'basic' | 'skill') => {
    setEditingPlayer({ playerId, field, currentValue, type });
    setEditValue(currentValue.toString());
    setEditModalVisible(true);
  };

  const handlePlayerPress = (playerId: string) => {
    console.log('Player pressed:', playerId);
    // Use player.id instead of player.playerId
    router.push(`/playerDetails?playerId=${playerId}`);
  };

  const confirmEdit = async () => {
    if (!editingPlayer) return;

    const { playerId, field, type } = editingPlayer;
    const newValue = type === 'skill' ? parseInt(editValue) : editValue;

    setEditModalVisible(false);

    try {
      if (type === 'basic') {
        await updateBasicInfo(playerId, field, newValue);
      } else {
        await updateSkill(playerId, field, newValue as number);
      }
      showSuccess(`${field} updated successfully`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update player');
    }

    setEditingPlayer(null);
    setEditValue('');
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerInList
      player={item}
      onEditField={(playerId, field, currentValue, type) => handleEditField(playerId, field, currentValue, type)}
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
        keyExtractor={(item) => item.id} // Use item.id for key
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editingPlayer?.field}</Text>
            <Text style={styles.modalSubtitle}>{editingPlayer?.type} field</Text>
            <TextInput
              style={styles.textInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingPlayer?.field}`}
              autoFocus
              keyboardType={editingPlayer?.type === 'skill' ? 'numeric' : 'default'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingPlayer(null);
                  setEditValue('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmEdit}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success/Error Modals */}
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
  // Add your modal styles here...
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    minWidth: 300,
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
});

export default RosterDetailScreen;