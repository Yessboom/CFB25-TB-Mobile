import BaseModal from '@/components/Modals';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Edit Modal 
interface EditModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  value: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  loading?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  visible,
  title,
  subtitle,
  value,
  onValueChange,
  onConfirm,
  onCancel,
  placeholder,
  keyboardType = 'default',
  loading = false
}) => {
  return (
    <BaseModal visible={visible} onClose={onCancel}>
      <Text style={styles.modalTitle}>Edit {title}</Text>
      {subtitle && <Text style={styles.modalSubtitle}>{subtitle}</Text>}
      
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onValueChange}
        placeholder={placeholder || `Enter ${title}`}
        autoFocus
        keyboardType={keyboardType}
      />
      
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={onConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

// Success Modal 
interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message,
  onClose,
  autoHide = true,
  duration = 2000
}) => {
  React.useEffect(() => {
    if (visible && autoHide) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, duration, onClose]);

  return (
    <BaseModal visible={visible} onClose={onClose || (() => {})}>
      <View style={styles.successModal}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.modalTitle}>Success</Text>
        <Text style={styles.modalMessage}>{message}</Text>
      </View>
    </BaseModal>
  );
};

// Error Modal 
interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  message,
  onClose,
  title = 'Error'
}) => {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.errorModal}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <TouchableOpacity style={styles.okButton} onPress={onClose}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

// Confirmation Modal 
interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: 'primary' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonStyle = 'primary'
}) => {
  return (
    <BaseModal visible={visible} onClose={onCancel}>
      <Text style={styles.modalTitle}>{title}</Text>
      <Text style={styles.modalMessage}>{message}</Text>
      
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>{cancelText}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            confirmButtonStyle === 'danger' && styles.dangerButton
          ]} 
          onPress={onConfirm}
        >
          <Text style={styles.confirmButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 16,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
    backgroundColor: '#007AFF',
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
  dangerButton: {
    backgroundColor: '#FF3B30',
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
    alignItems: 'center',
    borderColor: '#34C759',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  errorModal: {
    alignItems: 'center',
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
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