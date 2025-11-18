import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProfile } from '../src/api/profileApi';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const username = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await fetchProfile(username,userId)
      const data = await res.json();
      console.log("profile data",data)
      setProfile(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>

      {profile ? (
        <View style={styles.card}>
          <Text style={styles.info}>Name: {profile.name}</Text>
          <Text style={styles.info}>Email: {profile.email}</Text>
          <Text style={styles.info}>Phone: {profile.phone}</Text>
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
