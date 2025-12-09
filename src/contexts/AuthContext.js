// src/contexts/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { loginToAppian } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const savedId = await AsyncStorage.getItem('userId');
        if (savedId) {
          setUserId(savedId);
        }
      } catch (e) {
        console.log('restore error', e);
      } finally {
        setInitializing(false);
      }
    };
    restore();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await loginToAppian(username, password);
      console.log("Login response:", result);

      if (!result.success || !result.userId) {
        alert("Invalid credentials");
        return;
      }

      // save userId
      await AsyncStorage.setItem('userId', String(result.userId));
      await AsyncStorage.setItem('username', String(result.username));
      const fullName = [result.firstname, result.lastname]
        .filter(Boolean)      // removes null/undefined/empty
        .join(" ");

      await AsyncStorage.setItem("fullname", fullName);

      setUserId(String(result.userId));

    } catch (e) {
      console.log("login error:", e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'userId',
      'cachedProfile',
      'cachedEngagements',
      'cachedInvoices',
      'cachedExpenses',
      'username',
      'fullname'
    ]);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};
