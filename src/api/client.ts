import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token + timestamps for conflict resolution
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add timestamps for last-write-wins conflict resolution
  if (['post', 'patch', 'put'].includes(config.method?.toLowerCase() || '')) {
    const userRaw = localStorage.getItem('auth_user');
    const userId = userRaw ? JSON.parse(userRaw)?.id : 'unknown';
    config.data = {
      ...config.data,
      _lastModified: new Date().toISOString(),
      _modifiedBy: userId,
    };
  }

  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
