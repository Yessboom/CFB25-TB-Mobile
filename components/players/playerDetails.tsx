import ImageViewer from '@/components/ImageViewer';
import { formatHeight, formatWeight, getPositionName, getSkillBackgroundColor, getSkillValueColor } from '@/helpers/format';
import { getOverall } from '@/helpers/OverallCalculator';
import { usePlayerUpdate } from '@/hooks/usePlayers';
import { Player } from '@/types/FullTypes';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImpactPlayer from './ImpactPlayer';

interface PlayerDetailsProps {
  player: Player;
  onBack: () => void;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player: initialPlayer, onBack }) => {
  const { updateBasicInfo, updateSkill, loading: updateLoading } = usePlayerUpdate();
  
  // Local state to track player changes
  const [player, setPlayer] = useState<Player>(initialPlayer);
  
  // Modal states for editing
  const [editingField, setEditingField] = useState<{
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

  const handleEditField = (field: string, currentValue: string | number, type: 'basic' | 'skill') => {
    setEditingField({ field, currentValue, type });
    setEditValue(currentValue.toString());
    setEditModalVisible(true);
  };

  const confirmEdit = async () => {
    if (!editingField) return;

    const { field, type } = editingField;
    const newValue = type === 'skill' ? parseInt(editValue) : editValue;

    setEditModalVisible(false);

    try {
      if (type === 'basic') {
        const updatedPlayer = await updateBasicInfo(player.id, field, newValue);
        if (updatedPlayer) {
          // Update local state immediately
          setPlayer(prev => ({
            ...prev,
            [field]: newValue
          }));
        }
      } else {
        const updatedPlayer = await updateSkill(player.id, field, newValue as number);
        if (updatedPlayer) {
          // Update local state immediately
          setPlayer(prev => ({
            ...prev,
            [field]: newValue
          }));
        }
      }
      showSuccess(`${field} updated successfully`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update player');
    }

    setEditingField(null);
    setEditValue('');
  };

  // Group skills by category
  const skillCategories = {
    physical: [
      { key: 'speed', label: 'Speed', value: player.speed },
      { key: 'acceleration', label: 'Acceleration', value: player.acceleration },
      { key: 'agility', label: 'Agility', value: player.agility },
      { key: 'strength', label: 'Strength', value: player.strength },
      { key: 'jumping', label: 'Jumping', value: player.jumping },
      { key: 'stamina', label: 'Stamina', value: player.stamina },
      { key: 'awareness', label: 'Awareness', value: player.awareness },
    ],
    passing: [
      { key: 'throwPower', label: 'Throw Power', value: player.throwPower },
      { key: 'throwAccuracy', label: 'Throw Accuracy', value: player.throwAccuracy },
      { key: 'throwAccuracyShort', label: 'Short Accuracy', value: player.throwAccuracyShort },
      { key: 'throwAccuracyMid', label: 'Mid Accuracy', value: player.throwAccuracyMid },
      { key: 'throwAccuracyDeep', label: 'Deep Accuracy', value: player.throwAccuracyDeep },
    ],
    rushing: [
      { key: 'carrying', label: 'Carrying', value: player.carrying },
      { key: 'trucking', label: 'Trucking', value: player.trucking },
      { key: 'stiffArm', label: 'Stiff Arm', value: player.stiffArm },
      { key: 'spinMove', label: 'Spin Move', value: player.spinMove },
      { key: 'jukeMove', label: 'Juke Move', value: player.jukeMove },
      { key: 'breakTackle', label: 'Break Tackle', value: player.breakTackle },
    ],
    receiving: [
      { key: 'catching', label: 'Catching', value: player.catching },
      { key: 'spectacularCatch', label: 'Spectacular Catch', value: player.spectacularCatch },
      { key: 'catchInTraffic', label: 'Catch in Traffic', value: player.catchInTraffic },
      { key: 'shortRouteRun', label: 'Short Routes', value: player.shortRouteRun },
      { key: 'mediumRouteRun', label: 'Medium Routes', value: player.mediumRouteRun },
      { key: 'deepRouteRun', label: 'Deep Routes', value: player.deepRouteRun },
    ],
    defense: [
      { key: 'tackle', label: 'Tackle', value: player.tackle },
      { key: 'hitPower', label: 'Hit Power', value: player.hitPower },
      { key: 'powerMoves', label: 'Power Moves', value: player.powerMoves },
      { key: 'finesseMoves', label: 'Finesse Moves', value: player.finesseMoves },
      { key: 'blockShedding', label: 'Block Shedding', value: player.blockShedding },
      { key: 'pursuit', label: 'Pursuit', value: player.pursuit },
    ],
    coverage: [
      { key: 'manCoverage', label: 'Man Coverage', value: player.manCoverage },
      { key: 'zoneCoverage', label: 'Zone Coverage', value: player.zoneCoverage },
      { key: 'press', label: 'Press', value: player.press },
    ],
    blocking: [
      { key: 'runBlock', label: 'Run Block', value: player.runBlock },
      { key: 'passBlock', label: 'Pass Block', value: player.passBlock },
      { key: 'impactBlocking', label: 'Impact Block', value: player.impactBlocking },
    ],
  };

  const renderSkillItem = (skill: any) => {
    if (skill.value === undefined || skill.value === null) return null;

    return (
      <TouchableOpacity
        key={skill.key}
        style={[styles.skillItem, { backgroundColor: getSkillBackgroundColor(skill.value) }]}
        onPress={() => handleEditField(skill.key, skill.value, 'skill')}
      >
        <Text style={[styles.skillLabel, { color: getSkillValueColor(skill.value) }]}>
          {skill.label}
        </Text>
        <Text style={[styles.skillValue, { color: getSkillValueColor(skill.value) }]}>
          {skill.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSkillCategory = (categoryName: string, skills: any[]) => {
    const validSkills = skills.filter(skill => skill.value !== undefined && skill.value !== null);
    if (validSkills.length === 0) return null;

    return (
      <View key={categoryName} style={styles.skillCategory}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        <View style={styles.skillsGrid}>
          {validSkills.map(renderSkillItem)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Player Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Player Info Card */}
        <View style={styles.playerCard}>
          <View style={styles.playerHeader}>
            <View style={styles.playerImageContainer}>
              <ImageViewer
                imgSource={player.portraitImage}
                style={styles.playerImage}
                placeholderText="No Photo"
                showPlaceholder={true}
              />
            </View>
            
            <View style={styles.playerInfo}>
              <View style={styles.nameAndImpact}>
                <TouchableOpacity onPress={() => handleEditField('firstName', player.firstName || '', 'basic')}>
                  <Text style={styles.playerName}>
                    {player.firstName} {player.lastName || 'Unnamed Player'}
                  </Text>
                </TouchableOpacity>
                <ImpactPlayer isImpact={player.isImpactPlayer} />
              </View>
              
              <Text style={styles.playerPosition}>
                {getPositionName(player.position)} • Overall: {getOverall(player) || 'N/A'}
              </Text>
              <Text style={styles.playerId}>ID: {player.id}</Text>
            </View>
          </View>


        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.basicInfoGrid}>
            <TouchableOpacity 
              style={styles.basicInfoItem}
              onPress={() => handleEditField('position', player.position || '', 'basic')}
            >
              <Text style={styles.basicInfoLabel}>Position</Text>
              <Text style={styles.basicInfoValue}>{getPositionName(player.position)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.basicInfoItem}
              onPress={() => handleEditField('age', player.age || 0, 'basic')}
            >
              <Text style={styles.basicInfoLabel}>Age</Text>
              <Text style={styles.basicInfoValue}>{player.age || 'N/A'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.basicInfoItem}
              onPress={() => handleEditField('jerseyNumber', player.jerseyNumber || 0, 'basic')}
            >
              <Text style={styles.basicInfoLabel}>Jersey #</Text>
              <Text style={styles.basicInfoValue}>{player.jerseyNumber || 'N/A'}</Text>
            </TouchableOpacity>

            {player.height && (
              <View style={styles.basicInfoItem}>
                <Text style={styles.basicInfoLabel}>Height</Text>
                <Text style={styles.basicInfoValue}>{formatHeight(player.height)}</Text>
              </View>
            )}

            {player.weightPounds && (
              <View style={styles.basicInfoItem}>
                <Text style={styles.basicInfoLabel}>Weight</Text>
                <Text style={styles.basicInfoValue}>{formatWeight(player.weightPounds)}</Text>
              </View>
            )}

            {player.salary1 && (
              <TouchableOpacity 
                style={styles.basicInfoItem}
                onPress={() => handleEditField('salary1', player.salary1 || 0, 'basic')}
              >
                <Text style={styles.basicInfoLabel}>Salary</Text>
                <Text style={styles.basicInfoValue}>${player.salary1.toLocaleString()}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Skills Sections */}
        {Object.entries(skillCategories).map(([categoryName, skills]) => 
          renderSkillCategory(categoryName.charAt(0).toUpperCase() + categoryName.slice(1), skills)
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editingField?.field}</Text>
            <Text style={styles.modalSubtitle}>{editingField?.type} field</Text>
            <TextInput
              style={styles.textInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField?.field}`}
              autoFocus
              keyboardType={editingField?.type === 'skill' ? 'numeric' : 'default'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingField(null);
                  setEditValue('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmEdit}
                disabled={updateLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {updateLoading ? 'Saving...' : 'Save'}
                </Text>
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
    backgroundColor: '#f5f5f5',
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
  },
  headerSpacer: {
    width: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  playerImageContainer: {
    marginRight: 16,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameAndImpact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  playerPosition: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  playerId: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  bestAttributesSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  bestAttributesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bestAttributeItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bestAttributeName: {
    fontSize: 12,
    fontWeight: '500',
  },
  bestAttributeValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  basicInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  basicInfoItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    flexGrow: 1,
  },
  basicInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  basicInfoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  skillCategory: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '45%',
    flexGrow: 1,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  skillValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textTransform: 'capitalize',
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

export default PlayerDetails;