import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Error fetching auth session', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return loggedUser;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async ({ name, email, phone, password }) => {
    try {
      const newUser = await authService.register({ name, email, phone, password });
      setUser(newUser);
      addToast(`Account created. Welcome to Bytecart, ${newUser.name}!`, 'success');
      return newUser;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast('You have been signed out.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      addToast('Profile details updated successfully.', 'success');
      return updated;
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
