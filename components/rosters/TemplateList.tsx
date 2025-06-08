import { useRosters, useTemplates } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes'; // Adjust path to your types file
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TemplateListScreen = () => {
  const { templates, loading, error } = useTemplates();
  const { createRoster } = useRosters();

  const handleCreateFromTemplate = (templateId: string, templateName: string) => {
    Alert.prompt(
      'Create New Roster',
      `Enter a name for your new roster based on "${templateName}":`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (rosterName) => {
            if (!rosterName?.trim()) {
              Alert.alert('Error', 'Please enter a roster name');
              return;
            }

            try {
              await createRoster(templateId, rosterName.trim());
              Alert.alert('Success', 'Roster created successfully');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create roster');
            }
          }
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const renderTemplate = ({ item }: { item: Roster }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => handleCreateFromTemplate(item.rosterId, item.name || 'Unnamed Template')}
    >
      <View style={styles.templateInfo}>
        <Text style={styles.templateName}>{item.name || 'Unnamed Template'}</Text>
        <Text style={styles.templateCreator}>by {item.user?.username || 'Unknown'}</Text>
        <Text style={styles.playerCount}>{item.players.length} players</Text>
      </View>
    </TouchableOpacity>
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
      <Text style={styles.subtitle}>Tap a template to create a new roster</Text>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderTemplate}
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
    gap: 8,
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

export default TemplateListScreen;