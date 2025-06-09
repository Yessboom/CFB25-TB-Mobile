import { ConfirmationModal, EditModal, ErrorModal, SuccessModal } from '@/components/SpecificModal';
import { useModals } from '@/hooks/useModals';
import { useRosters } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RosterListScreen = () => {
  const { rosters, loading, error, deleteRoster, updateRoster, refetch } = useRosters();
  console.log('🎯 RosterListScreen render:', { 
    rostersCount: rosters?.length || 0, 
    loading, 
    error,
    hasRosters: !!rosters
  });
  useFocusEffect( useCallback(() => {
    console.log('🔄 Refetching rosters...');
    refetch();
  }, [refetch])); //used to refetch when I go to myRosters after creating a new one. 




  const router = useRouter();



  
  
  const {
    successModal,
    errorModal,
    showSuccess,
    hideSuccess,
    showError,
    hideError,

  } = useModals();

  // Local state for specific modals
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{rosterId: string, name: string} | null>(null);

  const handleRosterPress = (rosterId: string) => {
    console.log('🔍 Navigating to roster:', rosterId);
    
    if (!rosterId || rosterId === 'null' || rosterId === 'undefined') {
      showError('Invalid roster ID');
      return;
    }
    
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

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setPendingDelete(null);
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
      <Text style={styles.title}>My Rosters </Text>
      
      <FlatList
        data={rosters}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderRoster}
        contentContainerStyle={styles.list}
      />

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        title="Roster Name"
        value={editingName}
        onValueChange={setEditingName}
        onConfirm={confirmEdit}
        onCancel={handleEditCancel}
        placeholder="Enter roster name"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Roster"
        message={`Are you sure you want to delete "${pendingDelete?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModal.visible}
        message={successModal.message}
        onClose={hideSuccess}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModal.visible}
        message={errorModal.message}
        onClose={hideError}
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
});

export default RosterListScreen;