import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface ErrorDisplayProps {
  error: string | null;
  title?: string;
  severity?: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  title = 'Error', 
  severity = 'error',
  onClose 
}) => {
  if (!error) return null;

  return (
    <Alert severity={severity} onClose={onClose}>
      <AlertTitle>{title}</AlertTitle>
      {error}
    </Alert>
  );
};

export default ErrorDisplay;
