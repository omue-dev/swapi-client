import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40, 
  fullHeight = false 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center"
      sx={{ 
        minHeight: fullHeight ? '50vh' : 'auto',
        py: 2 
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
