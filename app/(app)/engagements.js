import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchHcpAllEngagements } from '../../src/api/engagementsApi';
import Loader from '../../src/components/loader';

export default function Engagements() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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

  const getEngagements = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetchHcpAllEngagements(token, userId);
      // res.source, res.data ...
      const engagementData = res?.data?.engagements;

      setItems(res?.data?.engagements ?? []);

      // ✔ Store to cache for offline use
      await AsyncStorage.setItem("cachedEngagements", JSON.stringify(engagementData));
      console.log("✔ Engagement cached");

    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const loadEngagements = async () => {
    setLoading(true);
    const storedUsername = await AsyncStorage.getItem("userToken");
    const storedUserId = await AsyncStorage.getItem("userId");

    // ⚡ Load cached profile instantly
    const cached = await AsyncStorage.getItem("cachedEngagements");
    if (cached) {
      setItems(cached?.data?.engagements ?? []);
      console.log("⚡ Loaded Engagements from cache");
    }

    if (storedUsername && storedUserId) {
      try {
        getEngagements()
      } catch (err) {
        console.error("API Error:", err);
      }
    }
    setLoading(false);
  };



  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US");
  };

  const renderItem = ({ item }) => (
    <View>
      {/* Row */}
      <TouchableOpacity onPress={() => toggleExpand(item.pkId)}>
        <View style={styles.row}>
          <Text style={styles.cellFirstItem}>{item.activityId}</Text>
          <Text style={styles.cell}>{item.engagementName}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Card */}
      {expandedId === item.pkId && (
        <View style={styles.card}>
          <Text style={styles.label}>Engagement Dates:</Text>
          <Text style={styles.value}>
            {formatDate(item.activityStartDateTime)} - {formatDate(item.activityEndDateTime)}
          </Text>

          <Text style={styles.label}>DSI Business Contact:</Text>
          <Text style={styles.value}>{item.initiator || "-"}</Text>
        </View>
      )}
    </View>
  );


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Engagement Details</Text>
      <Loader loading={loading} message="Loading..." />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Project ID</Text>
        <Text style={styles.headerText}>Name</Text>
      </View>

      {/* List */}
      {items & items.length>0 ? (<>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.pkId}
        />
      </>) : (
        <View style={styles.noItemsContainer}>
          <Text>No Engagements available</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  noItemsContainer: { padding: 20, margin: 10, alignItems: "center", border: "2px solid beige" },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 18, color: "#2d6cdf" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#135a9a",
    color: "white",
    padding: 10,
    marginTop: 45,
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
    backgroundColor: "#fff",
  },

  cell: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  cellFirstItem: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    color: "#135a9a",
  },

  card: {
    backgroundColor: "#f7f9fc",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d0d7e2",
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    color: "#135a9a",
  },

  value: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },

});
