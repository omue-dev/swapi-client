import { useState, useCallback } from 'react';
import { useSnackbar } from './useSnackbar';

interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown, fallbackMessage?: string) => void;
  clearError: () => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);
  const { showError } = useSnackbar();

  const handleError = useCallback((error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    let errorMessage = fallbackMessage;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    setError(errorMessage);
    showError(errorMessage);
  }, [showError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
};
