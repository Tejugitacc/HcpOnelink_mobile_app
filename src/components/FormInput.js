// app/src/components/FormInput.js
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormInput({ label, error, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error && { borderColor: '#e74c3c' }]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  error: { color: '#e74c3c', marginTop: 6, fontSize: 12 }
});
