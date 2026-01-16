import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://dsi-hcp-dev.appiancloud.com';

export async function apiFetch(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('accessToken');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Token expired → logout scenario
  if (response.status === 401) {
    throw new Error('Unauthorized – token expired');
  }

  return response.json();
}
