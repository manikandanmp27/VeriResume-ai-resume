import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('verita_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('verita_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('verita_token');
      if (storedToken) {
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('verita_user', JSON.stringify(currentUser));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, user: userData } = res;
    localStorage.setItem('verita_token', jwtToken);
    localStorage.setItem('verita_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const register = async (fullName, email, password) => {
    const res = await authApi.register({ fullName, email, password });
    const { token: jwtToken, user: userData } = res;
    localStorage.setItem('verita_token', jwtToken);
    localStorage.setItem('verita_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('verita_token');
    localStorage.removeItem('verita_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authApi.getCurrentUser();
      setUser(updatedUser);
      localStorage.setItem('verita_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
