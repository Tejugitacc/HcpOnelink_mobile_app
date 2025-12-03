import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />   {/* Public Login Page */}
        <Stack.Screen name="(app)" />   {/* Protected Pages */}
      </Stack>
    </AuthProvider>
  );
}
