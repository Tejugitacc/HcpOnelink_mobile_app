import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProfile } from '../src/api/profileApi';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedUsername = await AsyncStorage.getItem("userToken");
    const storedUserId = await AsyncStorage.getItem("userId");

    // ⚡ Load cached profile instantly
    const cached = await AsyncStorage.getItem("cachedProfile");
    if (cached) {
      setProfile(JSON.parse(cached));
      console.log("⚡ Loaded profile from cache");
    }

    if (storedUsername && storedUserId) {
      getProfile();
    } else {
      console.log("❌ Missing username/userId in AsyncStorage.");
    }
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetchProfile(token, userId);
      // res.source, res.data ...
      const profileData = res?.data?.profile?.[0];

      setProfile(profileData);

      // ✔ Store to cache for offline use
      await AsyncStorage.setItem("cachedProfile", JSON.stringify(profileData));
      console.log("✔ Profile cached");

    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>

      {profile ? (
        <View style={styles.card}>
          <Text style={styles.info}>Name: {profile.hcpFirstName} {profile.hcpLastName}</Text>
          <Text style={styles.info}>Email: {profile.hcpEmail}</Text>
          <Text style={styles.info}>Preferred Email: {profile.hcpPreferredEmail}</Text>
          <Text style={styles.info}>Phone: {profile.hcpPhone}</Text>
          <Text style={styles.info}>DSI ID: {profile.dsiId}</Text>
          <Text style={styles.info}>Status: {profile.hcpStatus}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 18, color: "#2d6cdf" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 10
  },
  info: { fontSize: 16, marginBottom: 6 }
});
