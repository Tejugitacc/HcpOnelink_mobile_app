import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { loginToAppian } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);


  const onLoginSuccess = async (username, userId) => {
    try {
      console.log("login repsonse 3", username, userId)
      await AsyncStorage.multiSet([
        ['userToken', username],
        ['userId', String(userId)]
      ]);
      // navigate to dashboard
    } catch (err) {
      console.error('Failed to save login data', err);
    }
  }

  const login = async (username, password) => {
    try {
      setLoading(true);

      const result = await loginToAppian(username, password);
      console.log("login repsonse 1", result);
      console.log("login 2 ", username, result.dsiID)
      if (!result.success) {
        alert(result.message);   
        setLoading(false);
        return;
      }
      await onLoginSuccess(username, result.dsiID)
      console.log("login repsonse 4", result)
      // Save user token locally (your choice)

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
    await AsyncStorage.removeItem('userId');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
