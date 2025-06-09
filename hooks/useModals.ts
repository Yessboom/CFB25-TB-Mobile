import { useState } from 'react';

export interface ModalState {
  visible: boolean;
  message: string;
}

export interface EditModalState {
  visible: boolean;
  field: string;
  currentValue: string | number;
  type: 'basic' | 'skill';
}

export const useModals = () => {
  const [successModal, setSuccessModal] = useState<ModalState>({
    visible: false,
    message: ''
  });

  const [errorModal, setErrorModal] = useState<ModalState>({
    visible: false,
    message: ''
  });

  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    field: '',
    currentValue: '',
    type: 'basic'
  });

  const [editValue, setEditValue] = useState('');

  const showSuccess = (message: string) => {
    setSuccessModal({ visible: true, message });
  };

  const hideSuccess = () => {
    setSuccessModal({ visible: false, message: '' });
  };

  const showError = (message: string) => {
    setErrorModal({ visible: true, message });
  };

  const hideError = () => {
    setErrorModal({ visible: false, message: '' });
  };

  const showEdit = (field: string, currentValue: string | number, type: 'basic' | 'skill') => {
    setEditModal({ visible: true, field, currentValue, type });
    setEditValue(currentValue.toString());
  };

  const hideEdit = () => {
    setEditModal({ visible: false, field: '', currentValue: '', type: 'basic' });
    setEditValue('');
  };

  return {
    // State
    successModal,
    errorModal,
    editModal,
    editValue,
    
    // Actions
    showSuccess,
    hideSuccess,
    showError,
    hideError,
    showEdit,
    hideEdit,
    setEditValue,
  };
};