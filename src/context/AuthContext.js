import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { loginToAppian } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);

      const result = await loginToAppian(username, password);

      if (!result.success) {
        alert(result.message);
        setLoading(false);
        return;
      }
      console.log("login repsonse",result)
      // Save user token locally (your choice)
      await AsyncStorage.setItem('userToken', username);
      await AsyncStorage.setItem('userID', result.dsiID);

      setUserToken(username);
    } catch (error) {
      console.log('Login error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
