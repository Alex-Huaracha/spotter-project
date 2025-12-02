import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.js';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // Register the user
  const signup = async (user) => {
    try {
      const res = await api.post('/auth/register', user);
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Save the backend error to display it in the form
      setErrors(
        error.response?.data?.errors || [
          { message: error.response?.data?.message },
        ]
      );
      throw error; // Re-throw so the form knows it failed
    }
  };

  // Login
  const signin = async (user) => {
    try {
      const res = await api.post('/auth/login', user);
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors([
        { message: error.response?.data?.message || 'Error logging in' },
      ]);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Update user data in context
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  // Check if the user is logged in on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get('/auth/me');
        if (!res.data.isAuthenticated) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // Clear errors after 5 seconds (Optional, good UX)
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        updateUser,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
