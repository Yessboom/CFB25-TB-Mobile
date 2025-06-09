import { EditModal, ErrorModal, SuccessModal } from '@/components/SpecificModal';
import { useModals } from '@/hooks/useModals';
import { useRosters, useTemplates } from '@/hooks/useRosters';
import { Roster } from '@/types/FullTypes';
import { Accelerometer } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

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



//THE SHUFFLING ON SHAKE DETECTION HERE HAS NOT POINT WHATSOEVER EXCPET THAT IT'S PART OF THE CLASS REQUIREMENTS.
//IT HASN'T BEEN TESTED ON MOBILE, BUT IT SHOULD WORK I HOPE. 
  // State for shuffled templates
  const [shuffledTemplates, setShuffledTemplates] = useState<Roster[]>([]);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);



  // Detect if running on desktop/web
  useEffect(() => {
    setIsDesktop(Platform.OS === 'web');
    console.log('📱 Platform detected:', Platform.OS);
  }, []);

  // Initialize shuffled templates when templates load
  useEffect(() => {
    if (templates) {
      setShuffledTemplates([...templates]);
    }
  }, [templates]);

  // Shake detection setup (mobile only)
  useEffect(() => {
    if (isDesktop) return; // Skip on desktop

    let subscription: any;

    const setupAccelerometer = async () => {
      try {
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const shakeThreshold = 1.5;
          const now = Date.now();
          const timeSinceLastShake = now - lastShakeTime;
          
          if (magnitude > shakeThreshold && timeSinceLastShake > 1000) {
            console.log('📱 Shake detected! Shuffling templates...');
            handleShuffle();
            setLastShakeTime(now);
          }
        });

        Accelerometer.setUpdateInterval(100);
      } catch (error) {
        console.log('Accelerometer not available:', error);
      }
    };

    setupAccelerometer();

    return () => subscription?.remove();
  }, [lastShakeTime, shuffledTemplates, isDesktop]);


  // Shuffle function 
  const handleShuffle = useCallback(() => {
    if (templates && templates.length > 0) {
      const shuffled = [...templates].sort(() => Math.random() - 0.5);
      setShuffledTemplates(shuffled);
      
      // Provide haptic feedback (mobile only)
      if (!isDesktop && Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }
      
      // Show success message
      showSuccess('Templates shuffled! 🎲');
      
      console.log('🎲 Templates shuffled');
    }
  }, [templates, isDesktop, showSuccess]);

    // Desktop keyboard shortcuts
useEffect(() => {
  console.log('🔑 Setting up keyboard shortcuts for desktop');
  if (!isDesktop) return;

  const handleKeyPress = (event: KeyboardEvent) => {
    console.log('🔑 Key pressed:', event.key, event.code); // Add this debug line
    
    // Shuffle on Space bar or 'S' key
    if (event.code === 'Space' || event.key.toLowerCase() === 's') {
      console.log('🎲 Space/S key detected, shuffling...');
      event.preventDefault();
      handleShuffle();
    }
    // Shuffle on 'R' key (for "random")
    if (event.key.toLowerCase() === 'r') {
      console.log('🎲 R key detected, shuffling...');
      event.preventDefault();
      handleShuffle();
    }
  };

  if (typeof window !== 'undefined') {
    console.log('🔑 Adding keyboard listener');
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      console.log('🔑 Removing keyboard listener');
      window.removeEventListener('keydown', handleKeyPress);
    };
  }
}, [isDesktop, handleShuffle]);


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
      
      {/* Dynamic hint based on platform */}
      {isDesktop ? (
        <Text style={styles.shakeHint}>
          💡 Press Space, S, or R to shuffle templates!
        </Text>
      ) : (
        <Text style={styles.shakeHint}>
          💡 Shake your phone to shuffle templates!
        </Text>
      )}
      
      <FlatList
        data={shuffledTemplates}
        keyExtractor={(item) => item.rosterId}
        renderItem={renderTemplate}
        contentContainerStyle={styles.list}
      />

      {/* Manual shuffle button - works on all platforms */}
      <TouchableOpacity style={styles.shuffleButton} onPress={handleShuffle}>
        <Text style={styles.shuffleButtonText}>
          🎲 Shuffle Templates {isDesktop ? '(Space/S/R)' : ''}
        </Text>
      </TouchableOpacity>

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
    marginBottom: 8,
  },
  shakeHint: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  list: {
    paddingBottom: 80, // Space for shuffle button
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
  shuffleButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shuffleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TemplateListScreen;