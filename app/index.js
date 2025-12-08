import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import { AuthContext } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const { login, userId, loading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});


  // -----------------------------------------
  // REDIRECT AFTER LOGIN 
  // -----------------------------------------
  useEffect(() => {
    if (userId) {
      const base64 = btoa(`${email}:${password}`);
      AsyncStorage.setItem('authToken', base64);
      router.replace('/(app)/dashboard');
    }
  }, [userId]);

  const validate = () => {
    const e = {};

    if (!email.trim()) e.email = 'Username is required';
    if (!password) e.password = 'Password is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    await login(email.trim(), password);
  };

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

        <FormInput
          value={email}
          onChangeText={setEmail}
          placeholder="Username"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          error={errors.password}
          
        />

        <PrimaryButton
          onPress={onSubmit}
          title={loading ? 'Logging in...' : 'SIGN IN'}
          disabled={loading}
        />

        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Use Appian Username / Password</Text>
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
  helpRow: { marginTop: 12, alignItems: 'center' },
  helpText: { color: '#444', fontSize: 13 },
  tinyLogo: { width: 50, height: 50 ,paddingBottom: 20,marginBottom: 20, alignSelf: "flex-start"  }
});
