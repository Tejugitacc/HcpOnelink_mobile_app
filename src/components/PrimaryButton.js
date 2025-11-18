// app/src/components/PrimaryButton.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    // backgroundColor: '#2563eb',
    backgroundColor: '#1d659c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  label: { color: '#fff', fontWeight: '700' }
});
