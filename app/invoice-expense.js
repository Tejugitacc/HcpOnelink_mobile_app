import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InvoiceExpense() {
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    setInvoice(data);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Invoice & Expense</Text>

      {invoice ? (
        <View style={styles.card}>
          <Text style={styles.info}>Invoice ID: {invoice.id}</Text>
          <Text style={styles.info}>Title: {invoice.title}</Text>
          <Text style={styles.info}>Status: {invoice.completed ? "Paid" : "Pending"}</Text>
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
    backgroundColor: "#eefaf2",
    padding: 20,
    borderRadius: 10
  },
  info: { fontSize: 16, marginBottom: 6 }
});
