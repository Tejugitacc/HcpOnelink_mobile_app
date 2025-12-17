// app\(app)\profile.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProfile } from '../../src/api/profileApi';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { userId } = useContext(AuthContext);   // Use AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/dashboard");
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProfile = async () => {
    try {
      const res = await fetchProfile(userId); // token removed
      const profileData = res?.profile?.[0];

      if (profileData) {
        setProfile(profileData);

        // save cache
        await AsyncStorage.setItem("cachedProfile", JSON.stringify(profileData));
        console.log("✔ Profile cached");
      }

    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };


  const loadData = async () => {
    setLoading(true);

    if (!userId) {
      console.log("❌ No logged-in user");
      return;
    }

    // ✔ Load cached profile first
    const cached = await AsyncStorage.getItem("cachedProfile");
    if (cached) {
      setProfile(JSON.parse(cached));
      console.log("⚡ Loaded profile from cache");
    }

    // ✔ Fetch from API
    getProfile();
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>

      {profile ? (
        <View style={styles.card}>
          <View style={styles.updateBtn}>
            <Button
              title="Edit Profile"
              onPress={() => router.push("/(app)/updateProfile")}
            />
          </View>

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
  container: { flex: 1, padding: 20, backgroundColor: "#fff",marginTop:40 },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 18, color: "#2d6cdf" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "rgb(142 169 241)",
    padding: 20,
    borderRadius: 10,
    margin: 8,
  },
  updateBtn: {
    padding: 10,
    borderRadius: 5,
    margin: 4,
  },
  info: { fontSize: 16, marginBottom: 6 }
});
