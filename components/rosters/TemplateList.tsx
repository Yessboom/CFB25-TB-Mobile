import { EditModal, ErrorModal, SuccessModal } from '@/components/SpecificModal';
import { useModals } from '@/hooks/useModals';
import { useRosters, useTemplates } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TemplateListScreen = () => {
  const { templates, loading, error } = useTemplates();
  const { createRoster } = useRosters();

  // Use the modals hook
  const {
    successModal,
    errorModal,
    showSuccess,
    hideSuccess,
    showError,
    hideError,
  } = useModals();

  // Local state for create modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Roster | null>(null);
  const [rosterName, setRosterName] = useState('');

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
        <Text style={styles.templateCreator}>ID: {item.rosterId || 'Unknown'}</Text>
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
      <EditModal
        visible={createModalVisible}
        title="Create New Roster"
        subtitle={`Based on: "${selectedTemplate?.name || 'Template'}"`}
        value={rosterName}
        onValueChange={setRosterName}
        onConfirm={confirmCreate}
        onCancel={cancelCreate}
        placeholder="Enter roster name"
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
});

export default TemplateListScreen;