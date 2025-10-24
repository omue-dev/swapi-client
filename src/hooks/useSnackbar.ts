import { useState, useCallback } from 'react';
import { SNACKBAR_CONFIG } from '../constants';

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

interface UseSnackbarReturn {
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  hideSnackbar: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('info');

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message: string) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showInfo = useCallback((message: string) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  const showWarning = useCallback((message: string) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  return {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
