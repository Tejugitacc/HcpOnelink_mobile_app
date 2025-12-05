
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Dashboard() {
  // const { userName } = useContext(AuthContext);
  const router = useRouter();



  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome</Text>
      {/* <Text style={styles.username}>{userName}</Text> */}
      <Text style={styles.subtitle}>You are now logged in via Appian Web API.</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(app)/profile')}>
        <Text style={styles.btnText}>View Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(app)/engagements')}>
        <Text style={styles.btnText}>View Engagements</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(app)/invoice-expense')}>
        <Text style={styles.btnText}>View Invoice & Expense</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d6cdf',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 30,
  },
  actionBtn: {
    backgroundColor: '#2d6cdf',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
