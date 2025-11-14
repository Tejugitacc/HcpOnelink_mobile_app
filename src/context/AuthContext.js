// app/src/context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { apiLogin } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    // load token from storage on mount
    const load = async () => {
      try {
        const t = await AsyncStorage.getItem('userToken');
        if (t) setUserToken(t);
      } catch (e) {
        console.warn('Failed to load token', e);
      } finally {
        setInitLoading(false);
      }
    };
    load();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // call local dummy api (or swap with real API)
      const res = await apiLogin(email, password);
      if (res.success) {
        setUserToken(res.token);
        await AsyncStorage.setItem('userToken', res.token);
        return { ok: true };
      } else {
        return { ok: false, message: res.message || 'Login failed' };
      }
    } catch (err) {
      console.error('login error', err);
      return { ok: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUserToken(null);
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.warn('logout error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, login, logout, loading, initLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
