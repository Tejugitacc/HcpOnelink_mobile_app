import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { loginToAppian } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);


  const onLoginSuccess = async (username, response) => {
    try {
      console.log("login repsonse 3", username, response.userId)
      await AsyncStorage.multiSet([
        ['userId', String(response.userId)],
        ['userToken', response.token],
        ['username', username]
      ]);
      setUserToken(response.token);
      // navigate to dashboard
    } catch (err) {
      console.error('Failed to save login data', err);
    }
  }

  const login = async (username, password) => {
    try {
      setLoading(true);

      const result = await loginToAppian(username, password);

      if (!result.success) {
        alert(result.message);
        setLoading(false);
        return;
      }
      await onLoginSuccess(username, result)
      setUserToken(username);
    } catch (error) {
      console.log('Login error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const keysToRemove = ['username', 'cachedProfile', 'userId',
       'userToken', 'cachedEngagements',
      'cachedInvoices', 'cachedExpenses'];

    try {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('Successfully removed multiple items.');
    } catch (error) {
      console.error('Error removing items:', error);
    }

    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
