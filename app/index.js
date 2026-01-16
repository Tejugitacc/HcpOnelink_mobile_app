import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import PrimaryButton from '../src/components/PrimaryButton';
import { AuthContext } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const { login, userId, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      router.replace('/(app)/dashboard');
    }
  }, [userId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={styles.card}>
        <Image
          style={styles.tinyLogo}
          source={require('../assets/images/favicon.png')}
        />

        <PrimaryButton
          onPress={login}
          title={loading ? 'Redirecting…' : 'Sign in with Appian'}
          disabled={loading}
        />

        <View style={styles.helpRow}>
          <Text style={styles.helpText}>
            You will be redirected to Appian to sign in
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7fa'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2
  },
  helpRow: { 
    marginTop: 12, 
    alignItems: 'center' 
  },
  helpText: { 
    color: '#444', 
    fontSize: 13 
  },
  tinyLogo: { 
    width: 50, 
    height: 50,
    marginBottom: 20,
    alignSelf: "flex-start"
  }
});
