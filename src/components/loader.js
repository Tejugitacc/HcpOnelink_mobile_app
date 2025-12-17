import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export default function Loader({ loading, message }) {
  return (
    <Modal
      visible={loading}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2d6cdf" />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: 140,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});
