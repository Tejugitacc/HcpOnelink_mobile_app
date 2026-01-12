// src/contexts/AuthContext.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const discovery = {
  authorizationEndpoint: 'https://dsi-hcp-dev.appiancloud.com/suite/authorization/oauth/token',
  tokenEndpoint: 'https://dsi-hcp-dev.appiancloud.com/suite/authorization/oauth/token',
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const refresh = await AsyncStorage.getItem('refreshToken');
      if (token) setAccessToken(token);
      if (refresh) setRefreshToken(refresh);
      setInitializing(false);
    };
    restore();
  }, []);

  const login = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'hcpone' });

    const request = new AuthSession.AuthRequest({
      clientId: '_G-nxucYngOrMdF6lOXdIs7l8JIESuOnYAK0DrjMY_Q',
      scopes: ['openid', 'profile'],
      redirectUri,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
    });

    await request.makeAuthUrlAsync(discovery);

    const result = await request.promptAsync(discovery);

    if (result.type !== 'success') return;

    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: '_G-nxucYngOrMdF6lOXdIs7l8JIESuOnYAK0DrjMY_Q',
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      },
      discovery
    );

    await AsyncStorage.multiSet([
      ['accessToken', tokenResponse.accessToken],
      ['refreshToken', tokenResponse.refreshToken],
    ]);

    setAccessToken(tokenResponse.accessToken);
    setRefreshToken(tokenResponse.refreshToken);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, accessToken, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};


