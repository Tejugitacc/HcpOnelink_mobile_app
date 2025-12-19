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
      const savedId = await AsyncStorage.getItem('userId');
      if (savedId) setUserId(savedId);
      setInitializing(false);
    };
    restore();
  }, []);

  const login = async (username, password) => {
    setLoading(true);

    const result = await loginToAppian(username, password);
    // console.log("Login response:", result);

    if (!result.success) {
      alert("Invalid credentials");
      setLoading(false);
      return;
    }

    // await AsyncStorage.multiSet([
    //   ['userId', String(result.userId)],
    //   ['username', result.username || ""],
    //   ['fullname', [result.firstname, result.lastname].filter(Boolean).join(" ")],
    // ]);

    // setUserId(String(result.userId));
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'userId',
      'username',
      'fullname',
      'cachedProfile',
      'cachedEngagements',
      'cachedInvoices',
      'cachedExpenses'
    ]);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};
