import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const checkLoggedIn = async () => {
    const token = localStorage.getItem('presensi_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('presensi_token');
        localStorage.removeItem('presensi_user');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('presensi_token');
      localStorage.removeItem('presensi_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const loginIntern = async (no_id, password) => {
    const res = await API.post('/auth/login-intern', { no_id, password });
    if (res.data.success) {
      localStorage.setItem('presensi_token', res.data.token);
      localStorage.setItem('presensi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const loginAdmin = async (email, password) => {
    const res = await API.post('/auth/login-admin', { email, password });
    if (res.data.success) {
      localStorage.setItem('presensi_token', res.data.token);
      localStorage.setItem('presensi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('presensi_token');
    localStorage.removeItem('presensi_user');
    setUser(null);
  };

  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('presensi_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        toggleTheme,
        loginIntern,
        loginAdmin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
