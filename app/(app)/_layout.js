import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../src/contexts/AuthContext';
import ProfileMenuButton from '../profileMenuBtn';

export default function ProtectedLayout() {
  const { userToken, loading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !userToken) {
      router.replace('/');
    }
  }, [loading, userToken]);

  // Show splash/blank screen while checking auth
  if (loading) return null;

  return (
    <>
      <ProfileMenuButton />

      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
