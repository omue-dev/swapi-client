import { ApiResponse } from '../interfaces/types';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    if (axiosError.response) {
      return {
        message: axiosError.response.data?.message || 'Server error occurred',
        status: axiosError.response.status,
        code: axiosError.response.data?.code,
      };
    } else if (axiosError.request) {
      return {
        message: 'No response received from the server',
        code: 'NETWORK_ERROR',
      };
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unknown error occurred',
  };
};

export const isApiResponse = <T>(obj: any): obj is ApiResponse<T> => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.success === 'boolean'
  );
};

export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  message,
  error,
});
