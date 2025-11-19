import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchHcpAllEngagements } from '../src/api/engagementsApi';

export default function Engagements() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadEngagements();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard"); 
    }
  };
  

  const loadEngagements = async () => {
    const storedUsername = await AsyncStorage.getItem("userToken");
    const storedUserId = await AsyncStorage.getItem("userId");

    if (storedUsername && storedUserId) {
      try {
        const res = await fetchHcpAllEngagements(storedUsername, storedUserId);
        setItems(res?.data?.engagements ?? []);
      } catch (err) {
        console.error("API Error:", err);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US");
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.activityId}</Text>
      <Text style={styles.cell}>{item.engagementName}</Text>
      <Text style={styles.cell}>
        {formatDate(item.activityStartDateTime)} - {formatDate(item.activityEndDateTime)}
      </Text>
      <Text style={styles.cell}>{item.initiator || "-"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Engagement Details</Text>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Project ID</Text>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Engagement Dates</Text>
        <Text style={styles.headerText}>DSI Business Contact</Text>
      </View>

      {/* List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.pkId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 18, color: "#2d6cdf" },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10,
    backgroundColor: "#135a9a",
    color: "white",
    padding: 10
  },

  header: {
    flexDirection: "row",
    backgroundColor: "#135a9a",
    padding: 12,
  },
  headerText: {
    flex: 1,
    color: "white",
    fontWeight: "bold"
  },

  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f7f7fa"
  },
  cell: {
    flex: 1,
    fontSize: 14,
  }
});
