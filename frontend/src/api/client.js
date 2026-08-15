import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('verita_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized: Session expired or invalid token
      if (error.response.status === 401) {
        const isAuthEndpoint = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
        if (!isAuthEndpoint) {
          localStorage.removeItem('verita_token');
          localStorage.removeItem('verita_user');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
            window.location.href = '/login?session_expired=true';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
