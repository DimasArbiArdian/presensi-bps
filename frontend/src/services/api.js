import axios from 'axios';

// In production, VITE_API_URL will point to backend (e.g., https://bps-presensi-backend.onrender.com/api)
// In local development, defaults to '/api' via Vite proxy
const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

/**
 * Helper to get full URL for uploaded files (photos, avatars)
 * In production: points to backend domain (e.g., https://bps-backend.onrender.com/uploads/...)
 * In development: points to /uploads/... via Vite proxy
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;

  const backendHost = import.meta.env.VITE_SERVER_URL || 
    (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : '');

  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${backendHost}${normalizedPath}`;
};

// Interceptor untuk pasang header Bearer token jika disimpan di localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('presensi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response untuk handle 401 unauthenticated
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token jika expired
      const isAuthRoute =
        window.location.pathname === '/' ||
        window.location.pathname === '/admin/login';
      if (!isAuthRoute) {
        localStorage.removeItem('presensi_token');
        localStorage.removeItem('presensi_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
