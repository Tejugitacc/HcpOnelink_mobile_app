export const authHeader = async () => {
  const token = await AsyncStorage.getItem('authToken');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
