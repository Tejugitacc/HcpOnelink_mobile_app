// app/index.js
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import { AuthContext } from '../src/context/AuthContext';

export default function LoginScreen() {
  const { login, userToken, loading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // if already logged in, go to dashboard
    if (userToken) {
      router.replace('/dashboard');
    }
  }, [userToken]);

  const validate = () => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(email.trim())) e.email = 'Enter a valid email';

    if (!password) e.password = 'Password is required';
    else if (password.length < 4)
      e.password = 'Password must be at least 4 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    await login(email.trim(), password);
    // login function will set token or not; useEffect above will route
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Please enter your email adress"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          error={errors.password}
        />

        <PrimaryButton
          onPress={onSubmit}
          title={loading ? 'Logging in...' : 'Login'}
          disabled={loading}
        />

        <View style={styles.helpRow}>
          <Text style={styles.helpText}>
            Use <Text style={{ fontWeight: '600' }}>test@example.com</Text> /{' '}
            <Text style={{ fontWeight: '600' }}>1234</Text> for dummy login
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
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 16 },
  helpRow: { marginTop: 12, alignItems: 'center' },
  helpText: { color: '#444', fontSize: 13 }
});
