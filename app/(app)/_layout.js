import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ProfileMenuButton from '../../src/components/profileMenuBtn';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function AppGroupLayout() {
  const { userId, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userId) {
    return <Redirect href="/" />;
  }

  return (
    <>
      {/* ✅ Display only for logged-in users */}
      <ProfileMenuButton />

      {/* Your authenticated screens */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
