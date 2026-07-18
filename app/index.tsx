import { Redirect } from 'expo-router';

import { useAppSelector } from '@/hooks';

export default function Index() {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  return (
    <Redirect
      href={isAuthenticated ? '/(tabs)/my-tasks' : '/(auth)/login'}
    />
  );
}
