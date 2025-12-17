// app/src/components/FormInput.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FormInput({ label, error, secureTextEntry, ...props }) {
  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputWrapper, error && { borderColor: '#e74c3c' }]}>
        <TextInput
          style={styles.input}
          secureTextEntry={hide}
          {...props}
        />

        {/* Eye Icon only if secureTextEntry is true */}
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHide(!hide)} style={styles.iconArea}>
            <Ionicons
              name={hide ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: '600' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingRight: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },

  iconArea: {
    paddingHorizontal: 4,
  },

  error: { color: '#e74c3c', marginTop: 6, fontSize: 12 },
});
