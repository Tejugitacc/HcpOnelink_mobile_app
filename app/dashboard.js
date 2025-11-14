// app/dashboard.js
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../src/components/PrimaryButton';
import { AuthContext } from '../src/context/AuthContext';

export default function Dashboard() {
  const { logout, userToken } = useContext(AuthContext);
  const router = useRouter();

  // If not logged in, redirect to login
  if (!userToken) {
    router.replace('/');
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hi}>Dashboard</Text>
      <Text style={styles.info}>
        You&apos;re logged in. Token:{' '}
        {userToken ? userToken.substring(0, 12) + '...' : 'none'}
      </Text>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton
          title="View Profile"
          onPress={() => router.push('/profile')}
        />
        <View style={{ height: 12 }} />
        <PrimaryButton
          title="Logout"
          onPress={() => {
            logout();
            router.replace('/');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  hi: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  info: { color: '#666' }
});
