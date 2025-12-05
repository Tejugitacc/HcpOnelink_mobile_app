import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

export async function authHeader() {
  const username = await AsyncStorage.getItem('username');
  const password = "Admin@123"; // For demo purposes only. In production, never hardcode passwords.

  const basicToken = Buffer.from(username + ":" + password).toString('base64');

  return {
    Authorization: `Basic ${basicToken}`,
    "Content-Type": "application/json",
  };
}
