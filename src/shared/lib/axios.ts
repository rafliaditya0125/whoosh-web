/**
 * Axios Instance Configuration
 * 
 * Configured axios instance with:
 * - Base URL from environment variable
 * - Request interceptor for JWT token
 * - Response interceptor for error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import type { ApiError } from '@/types';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds JWT token to Authorization header if available
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally and shows toast notifications
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      return Promise.reject({
        error: 'Network error',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      } as ApiError);
    }

    const { status, data } = error.response;

    // Handle different error types based on OpenAPI spec
    switch (status) {
      case 400: // Bad Request - Validation Error
        handleValidationError(data);
        break;
        
      case 401: // Unauthorized
        handleUnauthorizedError(data);
        break;
        
      case 403: // Forbidden
        handleForbiddenError(data);
        break;
        
      case 404: // Not Found
        handleNotFoundError(data);
        break;
        
      case 409: // Conflict
        handleConflictError(data);
        break;
        
      case 422: // Unprocessable Entity
        handleBusinessLogicError(data);
        break;
        
      case 500: // Internal Server Error
        handleServerError(data);
        break;
        
      default:
        toast.error(data?.error || 'Terjadi kesalahan. Silakan coba lagi.');
    }

    // Return structured error
    return Promise.reject(data || error);
  }
);

/**
 * Error Handlers
 */

function handleValidationError(data: ApiError): void {
  // Show field-level errors if available
  if (data.details?.fields) {
    const fieldErrors = Object.values(data.details.fields);
    fieldErrors.forEach((error) => {
      toast.error(error);
    });
  } else {
    toast.error(data.error || 'Data yang Anda masukkan tidak valid.');
  }
}

function handleUnauthorizedError(data: ApiError): void {
  // If it's invalid credentials (login failure), we don't want to clear token or show "session expired"
  if (data.code === 'INVALID_CREDENTIALS') {
    toast.error(data.error || 'Email atau kata sandi salah.');
    return;
  }

  // Clear auth data and redirect to login
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  toast.error(data.error || 'Sesi Anda telah berakhir. Silakan login kembali.');
  
  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

function handleForbiddenError(data: ApiError): void {
  toast.error(data.error || 'Anda tidak memiliki akses ke resource ini.');
}

function handleNotFoundError(data: ApiError): void {
  toast.error(data.error || 'Data yang Anda cari tidak ditemukan.');
}

function handleConflictError(data: ApiError): void {
  toast.error(data.error || 'Terjadi konflik data. Silakan periksa kembali.');
}

function handleBusinessLogicError(data: ApiError): void {
  toast.error(data.error || 'Operasi tidak dapat dilakukan.');
}

function handleServerError(data: ApiError): void {
  // Show error with reference code if available
  if (data.referenceCode) {
    toast.error(
      `${data.error || 'Terjadi kesalahan server.'}\nKode Error: ${data.referenceCode}`,
      { duration: 5000 }
    );
  } else {
    toast.error(data.error || 'Terjadi kesalahan server. Silakan coba lagi nanti.');
  }
}

export default axiosInstance;
