import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchHcpAllInvoicesExpenses } from '../src/api/invoiceExpensesAPis';
import Loader from "../src/components/loader";

export default function InvoiceExpense() {
  const router = useRouter();
  const [invoiceList, setInvoiceList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard"); 
    }
  };

  
  const loadInvoice = async () => {
    setLoading(true);
    const storedUsername = await AsyncStorage.getItem("userToken");
    const storedUserId = await AsyncStorage.getItem("userId");

    if (storedUsername && storedUserId) {
      try {
        const res = await fetchHcpAllInvoicesExpenses(storedUsername, storedUserId);

        const all = res?.data?.invoicesExpenses ?? [];

        const invoices = all.filter(item => item.recordType === "Invoice");
        const expenses = all.filter(item => item.recordType === "Expense");

        setInvoiceList(invoices);
        setExpenseList(expenses);

      } catch (err) {
        console.error("API Error:", err);
      }
    }

    setLoading(false);
  };

  const renderRow = (item) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.name]}>{item.engagementName}</Text>
      <Text style={[styles.cell]}>{item.contractNumber}</Text>
      
      {/* Invoice specific field */}
      {item.recordType === "Invoice" && (
        <Text style={[styles.cell, styles.link]}>{item.invoiceExpenseId}</Text>
      )}

      {/* Expense specific field */}
      {item.recordType === "Expense" && (
        <Text style={[styles.cell, styles.link]}>{item.invoiceExpenseId}</Text>
      )}

      <Text style={styles.cell}>{item.createdOn}</Text>
      <Text style={styles.cell}>${item.paymentTotal}</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  const renderTable = (title, data) => (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Loader loading={loading} message="Loading..." />
{/* 
        <TouchableOpacity onPress={loadInvoice}>
          <Text style={styles.refreshBtn}>🔄</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.name]}>Engagement Name</Text>
        <Text style={styles.headerCell}>Contract #</Text>
        <Text style={styles.headerCell}>{title === "Invoices" ? "Invoice #" : "Expense ID"}</Text>
        <Text style={styles.headerCell}>Submission Date</Text>
        <Text style={styles.headerCell}>Total</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      {data.length === 0 ? (
        <Text style={styles.emptyText}>No items available</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderRow(item)}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
  
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Invoice & Expense</Text>

      {renderTable("Invoices", invoiceList)}
      {renderTable("Expenses", expenseList)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 18, color: "#2d6cdf" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },

  section: { marginTop: 25, backgroundColor: "#f6f9fc", borderRadius: 8, paddingBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#0d5db0", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  refreshBtn: { fontSize: 22, color: "#fff" },

  tableHeader: { flexDirection: "row", padding: 10, backgroundColor: "#dce9f6" },
  headerCell: { flex: 1, fontWeight: "bold", fontSize: 12, color: "#003366" },

  row: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: "#e5e5e5" },
  cell: { flex: 1, fontSize: 12, color: "#333" },
  name: { flex: 2 },
  link: { color: "#2d6cdf", fontWeight: "bold" },

  emptyText: { textAlign: "center", padding: 15, fontSize: 14, color: "#666" },

  statusBox: {
    backgroundColor: "#e5f1ff",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: "flex-start"
  },
  statusText: {
    fontSize: 11,
    color: "#004a99",
    fontWeight: "bold"
  }
});
