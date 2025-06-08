import { useRosters, useTemplates } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TemplateListScreen = () => {
  const { templates, loading, error } = useTemplates();
  const { createRoster } = useRosters();

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  
  // Modal content
  const [selectedTemplate, setSelectedTemplate] = useState<Roster | null>(null);
  const [rosterName, setRosterName] = useState('');
  const [modalMessage, setModalMessage] = useState('');

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

  const handleCreateFromTemplate = (template: Roster) => {
    setSelectedTemplate(template);
    setRosterName(`${template.name || 'Unnamed Template'} - Copy`);
    setCreateModalVisible(true);
  };

  const confirmCreate = async () => {
    if (!selectedTemplate || !rosterName.trim()) {
      showError('Please enter a roster name');
      return;
    }

    setCreateModalVisible(false);

    try {
      await createRoster(selectedTemplate.rosterId, rosterName.trim());
      showSuccess('Roster created successfully');
      setSelectedTemplate(null);
      setRosterName('');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create roster');
    }
  };

  const cancelCreate = () => {
    setCreateModalVisible(false);
    setSelectedTemplate(null);
    setRosterName('');
  };

  const renderTemplate = ({ item }: { item: Roster }) => (
    <View style={styles.templateItem}>
      <View style={styles.templateInfo}>
        <Text style={styles.templateName}>{item.name || 'Unnamed Template'}</Text>
        <Text style={styles.templateCreator}>id {item.rosterId || 'Unknown'}</Text>
        <Text style={styles.playerCount}>{item.players?.length || 0} players</Text>
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => handleCreateFromTemplate(item)}
      >
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading templates...</Text>
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
      <Text style={styles.title}>Roster Templates</Text>
      <Text style={styles.subtitle}>Create new rosters from these templates</Text>
      
      <FlatList
        data={templates}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderTemplate}
        contentContainerStyle={styles.list}
      />

      {/* Create Roster Modal */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Roster</Text>
            <Text style={styles.modalSubtitle}>
              Based on: &quot;{selectedTemplate?.name || 'Template'}&quot;
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Roster Name:</Text>
              <TextInput
                style={styles.textInput}
                value={rosterName}
                onChangeText={setRosterName}
                placeholder="Enter roster name"
                autoFocus
                selectTextOnFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelCreate}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmCreate}
              >
                <Text style={styles.confirmButtonText}>Create</Text>
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
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  templateItem: {
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
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
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
  createButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
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
    minWidth: 320,
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
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
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

export default TemplateListScreen;