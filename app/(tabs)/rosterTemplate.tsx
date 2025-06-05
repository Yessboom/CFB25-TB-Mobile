import { Roster, User } from '@/types/FullTypes';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_BASE = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api' 
  : 'http://localhost:3000/api';

// API functions using your endpoints
const api = {
  async getUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/user`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  async getTemplates(): Promise<Roster[]> {
    try {
      const response = await fetch(`${API_BASE}/rosters/templates`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data.success ? data.templates : [];
    } catch (error) {
      console.error('Failed to get templates:', error);
      return [];
    }
  },

  async createRosterFromTemplate(templateId: string, rosterName: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/rosters/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ templateId, rosterName })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Failed to create roster:', error);
      return false;
    }
  }
};

export default function RosterTemplates() {
  const [user, setUser] = useState<User | null>(null);
  const [templates, setTemplates] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingRoster, setCreatingRoster] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [rosterName, setRosterName] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [userData, templatesData] = await Promise.all([
          api.getUser(),
          api.getTemplates()
        ]);
        setUser(userData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateRoster = async (templateId?: string, customName?: string) => {
    const useTemplateId = templateId || selectedTemplate;
    const useName = customName || rosterName;
    
    if (!useTemplateId || !useName.trim()) {
      Alert.alert('Error', 'Please select a template and enter a roster name');
      return;
    }

    const creationKey = `${useTemplateId}-${useName}`;
    setCreatingRoster(prev => [...prev, creationKey]);

    try {
      const success = await api.createRosterFromTemplate(useTemplateId, useName.trim());
      
      if (success) {
        // Clear form
        setSelectedTemplate('');
        setRosterName('');
        
        Alert.alert('Success', 'Roster created successfully!');
        // Navigate to rosters page
        router.push('/(tabs)/about');
      } else {
        Alert.alert('Error', 'Failed to create roster. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create roster:', error);
      Alert.alert('Error', 'Failed to create roster. Please try again.');
    } finally {
      setCreatingRoster(prev => prev.filter(key => key !== creationKey));
    }
  };

  const handleQuickCreate = async (template: Roster) => {
    const name = `Copy of ${template.name || 'Template'}`;
    await handleCreateRoster(template.rosterId, name);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Roster Templates</Text>
        <Text style={styles.subtitle}>Found {templates.length} templates</Text>

        {/* Create roster form - only show if user is logged in */}
        {user && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create New Roster from Template</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Template:</Text>
              <View style={styles.pickerContainer}>
                {/* Simple text showing selected template - you'd want a proper picker here */}
                <Text style={styles.pickerText}>
                  {selectedTemplate ? 
                    templates.find(t => t.rosterId === selectedTemplate)?.name || 'Selected' 
                    : 'Choose a template...'
                  }
                </Text>
              </View>
              {/* Template buttons */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
                {templates.map((template) => (
                  <TouchableOpacity
                    key={template.rosterId}
                    onPress={() => setSelectedTemplate(template.rosterId)}
                    style={[
                      styles.templateButton,
                      selectedTemplate === template.rosterId && styles.selectedTemplate
                    ]}
                  >
                    <Text style={[
                      styles.templateButtonText,
                      selectedTemplate === template.rosterId && styles.selectedTemplateText
                    ]}>
                      {template.name || 'Unnamed'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Roster Name:</Text>
              <TextInput
                style={styles.textInput}
                value={rosterName}
                onChangeText={setRosterName}
                placeholder="Enter name for your new roster"
              />
            </View>
            
            <TouchableOpacity
              onPress={() => handleCreateRoster()}
              disabled={creatingRoster.length > 0}
              style={[styles.createButton, creatingRoster.length > 0 && styles.disabledButton]}
            >
              {creatingRoster.length > 0 ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Roster</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Template list */}
        <View style={styles.templatesSection}>
          <Text style={styles.sectionTitle}>Available Templates</Text>
          {templates.length === 0 ? (
            <Text style={styles.noTemplatesText}>No templates available.</Text>
          ) : (
            <View style={styles.templateGrid}>
              {templates.map((template) => (
                <View key={template.rosterId} style={styles.templateCard}>
                  <Text style={styles.templateName}>
                    {template.name || "(no name)"}
                  </Text>
                  <Text style={styles.templateInfo}>
                    {template.players?.length || 0} players
                  </Text>
                  {template.user?.username && (
                    <Text style={styles.templateCreator}>
                      Created by: {template.user.username}
                    </Text>
                  )}
                  
                  <View style={styles.templateActions}>
                    <TouchableOpacity
                      onPress={() => router.push(`/(tabs)/about`)}
                      style={styles.viewButton}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                    
                    {user && (
                      <TouchableOpacity
                        onPress={() => handleQuickCreate(template)}
                        disabled={creatingRoster.includes(`${template.rosterId}-Copy of ${template.name || 'Template'}`)}
                        style={[
                          styles.copyButton,
                          creatingRoster.includes(`${template.rosterId}-Copy of ${template.name || 'Template'}`) && styles.disabledButton
                        ]}
                      >
                        <Text style={styles.copyButtonText}>
                          {creatingRoster.includes(`${template.rosterId}-Copy of ${template.name || 'Template'}`)
                            ? 'Creating...'
                            : 'Create Copy'
                          }
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>
              <Text 
                style={styles.loginLink}
                onPress={() => router.push('/(tabs)/login')}
              >
                Log in
              </Text>
              {' '}to create your own rosters from these templates.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  templateScroll: {
    marginTop: 8,
  },
  templateButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTemplate: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  templateButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedTemplateText: {
    color: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  templatesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  noTemplatesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 32,
  },
  templateGrid: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  templateInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  templateCreator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  loginPrompt: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#92400e',
  },
  loginLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});