import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import AuthBootstrap from '@/components/AuthBootstrap';
import NotificationBootstrap from '@/components/NotificationBootstrap';
import { store } from '@/store/store';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <StatusBar style="dark" />
          <AuthBootstrap>
            <NotificationBootstrap />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </AuthBootstrap>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
