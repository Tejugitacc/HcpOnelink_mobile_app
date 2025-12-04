import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import ProfileMenuBtn from '../../src/components/profileMenuBtn';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function ProtectedLayout() {
  const { userToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!userToken) {
      router.replace('/');
    }
  }, [userToken]);

  return (
    <>
      <ProfileMenuBtn />      {/* Shows only when logged in */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="engagements" />
        <Stack.Screen name="invoice-expense" />
      </Stack>
    </>
  );
}
