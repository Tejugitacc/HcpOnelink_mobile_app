import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="updateProfile" />
        <Stack.Screen name="engagements" />
        <Stack.Screen name="invoice-expense" />
      </Stack>
    </AuthProvider>
  );
}
