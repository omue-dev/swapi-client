import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

interface SaveButtonProps {
  loading: boolean;
  onClick: (event: React.FormEvent) => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ loading, onClick, disabled = false }) => {
  return (
    <Box className="sticky-save-button">
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        onClick={onClick} 
        disabled={loading || disabled}
      >
        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
      </Button>
    </Box>
  );
};

export default SaveButton;
