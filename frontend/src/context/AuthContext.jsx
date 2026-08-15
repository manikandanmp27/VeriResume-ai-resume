import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('veriresume_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('veriresume_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firebase Authentication State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken();
          localStorage.setItem('veriresume_token', idToken);
          setToken(idToken);

          // Sync with Spring Boot backend to retrieve local User DTO & Profile
          const localUser = await authApi.getCurrentUser();
          setUser(localUser);
          localStorage.setItem('veriresume_user', JSON.stringify(localUser));
        } catch (err) {
          console.warn('Backend user synchronization error (offline or local fallback):', err.message);
          // Construct fallback user object from Firebase credentials
          const fallbackUser = {
            id: fbUser.uid,
            firebaseUid: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
            role: 'ROLE_USER',
          };
          setUser(fallbackUser);
          localStorage.setItem('veriresume_user', JSON.stringify(fallbackUser));
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        localStorage.removeItem('veriresume_token');
        localStorage.removeItem('veriresume_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Email/Password Sign In
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;
    const idToken = await fbUser.getIdToken();
    localStorage.setItem('veriresume_token', idToken);
    setToken(idToken);
    setFirebaseUser(fbUser);

    try {
      const localUser = await authApi.getCurrentUser();
      setUser(localUser);
      localStorage.setItem('veriresume_user', JSON.stringify(localUser));
      return { user: localUser, token: idToken };
    } catch {
      const fallbackUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email.split('@')[0],
        role: 'ROLE_USER',
      };
      setUser(fallbackUser);
      return { user: fallbackUser, token: idToken };
    }
  };

  // Firebase Email/Password Sign Up
  const register = async (fullName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    // Update display name in Firebase
    if (fullName) {
      try {
        await updateProfile(fbUser, { displayName: fullName.trim() });
      } catch (err) {
        console.warn('Could not update Firebase displayName:', err);
      }
    }

    const idToken = await fbUser.getIdToken(true);
    localStorage.setItem('veriresume_token', idToken);
    setToken(idToken);
    setFirebaseUser(fbUser);

    try {
      const localUser = await authApi.getCurrentUser();
      setUser(localUser);
      localStorage.setItem('veriresume_user', JSON.stringify(localUser));
      return { user: localUser, token: idToken };
    } catch {
      const fallbackUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        fullName: fullName || fbUser.email.split('@')[0],
        role: 'ROLE_USER',
      };
      setUser(fallbackUser);
      return { user: fallbackUser, token: idToken };
    }
  };

  // Firebase Sign Out
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Firebase sign out error:', err);
    } finally {
      localStorage.removeItem('veriresume_token');
      localStorage.removeItem('veriresume_user');
      setFirebaseUser(null);
      setUser(null);
      setToken(null);
    }
  };

  // Acquire fresh Firebase ID Token
  const getIdToken = async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    const freshToken = await auth.currentUser.getIdToken(forceRefresh);
    localStorage.setItem('veriresume_token', freshToken);
    setToken(freshToken);
    return freshToken;
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authApi.getCurrentUser();
      setUser(updatedUser);
      localStorage.setItem('veriresume_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    firebaseUser,
    token,
    isAuthenticated: !!firebaseUser || (!!token && !!user),
    isLoading,
    login,
    register,
    logout,
    getIdToken,
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
