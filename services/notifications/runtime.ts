import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';

/**
 * Expo Go on Android throws when expo-notifications is imported (push APIs removed in SDK 53).
 * Local notifications still work in development/production builds and Expo Go on iOS.
 */
export function canUseNativeNotifications(): boolean {
  if (Platform.OS === 'web') return false;
  if (isRunningInExpoGo() && Platform.OS === 'android') return false;
  return true;
}

type NotificationsModule = typeof import('expo-notifications');

let cachedModule: NotificationsModule | null | undefined;

export function getNotificationsModule(): NotificationsModule | null {
  if (!canUseNativeNotifications()) {
    return null;
  }

  if (cachedModule !== undefined) {
    return cachedModule;
  }

  try {
    // Lazy require avoids Expo Go Android crashing on static import side-effects.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('expo-notifications') as NotificationsModule;
    return cachedModule;
  } catch (error) {
    console.warn('expo-notifications unavailable:', error);
    cachedModule = null;
    return null;
  }
}
