import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, getMe, updateProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on first mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Optionally refresh profile in the background
          try {
            const fresh = await getMe();
            if (fresh.success && fresh.data) {
              const updated = { ...parsedUser, ...fresh.data };
              setUser(updated);
              localStorage.setItem('userInfo', JSON.stringify(updated));
            }
          } catch (e) {
            // Token might be expired
            if (e.response?.status === 401) {
              logoutUser();
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse stored user', err);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setError(null);
  };

  // Update profile
  const updateUserProfile = async (profileData) => {
    setError(null);
    try {
      const response = await updateProfile(profileData);
      if (response.success && response.data) {
        const updated = { ...user, ...response.data };
        setUser(updated);
        localStorage.setItem('userInfo', JSON.stringify(updated));
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
