import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwt from 'jwt-decode';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { loginToAppian } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  // to store logout timer (prevents multiple timers)
  const logoutTimer = useRef(null);

  console.log("AuthProvider rendered with userName:", userName, "and userToken:", userToken);

  // -----------------------------------------
  // AUTO LOGOUT WHEN JWT EXPIRES
  // -----------------------------------------
  const scheduleAutoLogout = (token) => {
    try {
      const decoded = jwt.jwtDecode(token);
      const expiry = decoded.exp * 1000;
      const now = Date.now();
      const timeLeft = expiry - now;

      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }

      if (timeLeft <= 0) {
        logout();
        return;
      }

      logoutTimer.current = setTimeout(() => {
        logout();
      }, timeLeft);

      console.log("Auto logout scheduled in:", timeLeft / 1000, "seconds");

    } catch (err) {
      console.error("Token decode failed → forcing logout:", err);
      logout();
    }
  };

  // -----------------------------------------
  // LOGIN
  // -----------------------------------------
  const onLoginSuccess = async (username, response) => {
    try {
      await AsyncStorage.multiSet([
        ['userId', String(response.userId)],
        ['userToken', response.token],
        ['username', username]
      ]);

      setUserToken(response.token);
      setUserName(username);

      scheduleAutoLogout(response.token);
    } catch (err) {
      console.error('Failed to save login data', err);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);

      const result = await loginToAppian(username, password);

      if (!result.success) {
        alert(result.message);
        setLoading(false);
        return;
      }

      await onLoginSuccess(username, result);

    } catch (error) {
      console.log('Login error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  const logout = async () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    const keysToRemove = [
      'username', 'cachedProfile', 'userId',
      'userToken', 'cachedEngagements',
      'cachedInvoices', 'cachedExpenses'
    ];

    try {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('Successfully removed multiple items.');
    } catch (error) {
      console.error('Error removing items:', error);
    }

    setUserToken(null);
    setUserName(null);
  };

  // -----------------------------------------
  // RESTORE SESSION ON APP LAUNCH
  // -----------------------------------------
  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const username = await AsyncStorage.getItem('username');

      if (token) {
        try {
          const decoded = jwt.jwtDecode(token);

          if (decoded.exp * 1000 > Date.now()) {
            // token is valid
            setUserToken(token);
            setUserName(username);
            scheduleAutoLogout(token);
          } else {
            // token expired
            console.log("Token expired → forcing logout");
            logout();
          }
        } catch (err) {
          console.log("Failed to decode stored token → logout");
          logout();
        }
      }

    } catch (error) {
      console.error("Restore session failed:", error);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken, loading, userName }}>
      {children}
    </AuthContext.Provider>
  );
};
