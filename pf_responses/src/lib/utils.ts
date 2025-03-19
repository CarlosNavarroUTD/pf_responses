import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/utils/error-handler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data.error || 'Invalid data provided'
        };
      case 401:
        return {
          type: 'auth',
          message: 'Please login to continue'
        };
      case 403:
        return {
          type: 'permission',
          message: 'You don\'t have permission to perform this action'
        };
      default:
        return {
          type: 'server',
          message: 'Something went wrong'
        };
    }
  }
  
  return {
    type: 'network',
    message: 'Network error occurred'
  };
};