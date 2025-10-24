import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbar, SnackbarSeverity } from '../../hooks/useSnackbar';
import { SNACKBAR_CONFIG } from '../../constants';

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const { snackbarOpen, snackbarMessage, snackbarSeverity, hideSnackbar } = useSnackbar();

  return (
    <>
      {children}
      <Snackbar 
        anchorOrigin={SNACKBAR_CONFIG.ANCHOR_ORIGIN} 
        open={snackbarOpen} 
        autoHideDuration={SNACKBAR_CONFIG.AUTO_HIDE_DURATION} 
        onClose={hideSnackbar}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbarSeverity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
