// app/profile.js
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../src/components/PrimaryButton';
import { AuthContext } from '../src/context/AuthContext';

export default function Profile() {
  const { userToken, logout } = useContext(AuthContext);
  const router = useRouter();

  if (!userToken) {
    router.replace('/');
    return null;
  }

  // Dummy profile data — replace with real API fetch using userToken
  const profile = {
    name: 'Test User',
    email: 'test@example.com',
    memberSince: '2023-01-01'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.row}>
        <Text style={styles.label}>Name: </Text>
        {profile.name}
      </Text>
      <Text style={styles.row}>
        <Text style={styles.label}>Email: </Text>
        {profile.email}
      </Text>
      <Text style={styles.row}>
        <Text style={styles.label}>Member since: </Text>
        {profile.memberSince}
      </Text>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton
          title="Back to Dashboard"
          onPress={() => router.back()}
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  row: { fontSize: 16, marginBottom: 10, color: '#222' },
  label: { fontWeight: '600' }
});
