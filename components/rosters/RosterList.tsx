import { useRosters } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RosterListScreen = () => {
  const { rosters, loading, error, deleteRoster, updateRoster } = useRosters();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  // Modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Modal content
  const [modalMessage, setModalMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{rosterId: string, name: string} | null>(null);

  const showSuccess = (message: string) => {
    setModalMessage(message);
    setSuccessModalVisible(true);
    // Auto-hide after 2 seconds
    setTimeout(() => setSuccessModalVisible(false), 2000);
  };

  const showError = (message: string) => {
    setModalMessage(message);
    setErrorModalVisible(true);
  };

  const handleRosterPress = (rosterId: string) => {
    console.log('🔍 Navigating to roster:', rosterId);
    
    if (!rosterId || rosterId === 'null' || rosterId === 'undefined') {
      showError('Invalid roster ID');
      return;
    }
    
    // Navigate to the roster details page
    router.push(`/rosterDetails?rosterId=${rosterId}`);
  };

  const handleDeletePress = (rosterId: string, rosterName: string) => {
    console.log(`Delete button pressed: ${rosterId} - ${rosterName}`);
    setPendingDelete({ rosterId, name: rosterName });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    
    setDeleteModalVisible(false);
    
    try {
      await deleteRoster(pendingDelete.rosterId);
      showSuccess('Roster deleted successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete roster');
    }
    
    setPendingDelete(null);
  };

  const handleEditPress = (rosterId: string, currentName: string) => {
    setEditingId(rosterId);
    setEditingName(currentName);
    setEditModalVisible(true);
  };

  const confirmEdit = async () => {
    if (!editingId || !editingName.trim()) {
      showError('Please enter a valid name');
      return;
    }

    setEditModalVisible(false);
    
    try {
      await updateRoster(editingId, editingName.trim());
      showSuccess('Roster updated successfully');
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update roster');
    }
  };

  const renderRoster = ({ item }: { item: Roster }) => (
    <View style={styles.rosterItem}>
      <TouchableOpacity 
        style={styles.rosterInfo}
        onPress={() => handleRosterPress(item.rosterId)}
      >
        <Text style={styles.rosterName}>{item.name || 'Unnamed Roster'}</Text>
        <Text style={styles.playerCount}>{item.players?.length || 0} players</Text>
        <Text style={styles.playerCount}>ID: {item.rosterId}</Text>
        <Text style={styles.tapHint}>Tap to view players →</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditPress(item.rosterId, item.name || '')}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePress(item.rosterId, item.name || 'Unnamed Roster')}
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
      <Text style={styles.title}>My Rosters ({rosters.length})</Text>
      
      <FlatList
        data={rosters}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderRoster}
        contentContainerStyle={styles.list}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Roster</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete &quot;{pendingDelete?.name}&quot;?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setPendingDelete(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Roster Name</Text>
            <TextInput
              style={styles.textInput}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Enter roster name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingId(null);
                  setEditingName('');
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

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.successModal]}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={errorModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.errorModal]}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rosterInfo: {
    flex: 1,
  },
  rosterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  playerCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tapHint: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
  
  // Modal styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
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
    backgroundColor: '#FF3B30',
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
  okButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  okButtonText: {
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
  successModal: {
    borderColor: '#34C759',
    borderWidth: 2,
  },
  errorModal: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
});

export default RosterListScreen;