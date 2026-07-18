import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 280,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="role-select" />
      <Stack.Screen name="staff-search" />
      <Stack.Screen name="login-behalf" />
    </Stack>
  );
}
