import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Firebase ID Bearer token
client.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken();
        localStorage.setItem('veriresume_token', token);
      } else {
        token = localStorage.getItem('veriresume_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Could not retrieve Firebase ID token for request:', err);
      const cachedToken = localStorage.getItem('veriresume_token');
      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      }
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
          localStorage.removeItem('veriresume_token');
          localStorage.removeItem('veriresume_user');
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
