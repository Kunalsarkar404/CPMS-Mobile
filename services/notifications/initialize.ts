import { Platform } from 'react-native';

import { ensureNotificationChannels } from './channels';
import { requestNotificationPermission } from './delivery';
import { canUseNativeNotifications } from './runtime';
import { preparePushTokenRegistration } from './token';

let initialized = false;

/**
 * Configures channels, requests permission, and prepares push-token readiness.
 * Safe to call multiple times. No local reminders are scheduled on login.
 */
export async function initializeNotifications(): Promise<{
  permissionGranted: boolean;
  pushReady: boolean;
}> {
  if (Platform.OS === 'web' || !canUseNativeNotifications()) {
    return { permissionGranted: false, pushReady: false };
  }

  try {
    await ensureNotificationChannels();

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      initialized = true;
      return { permissionGranted: false, pushReady: false };
    }

    const pushRegistration = await preparePushTokenRegistration();
    if (pushRegistration.status === 'ready') {
      // Ready for a future backend registration call.
      // Intentionally not POSTed until a real endpoint exists.
      console.info(
        'Expo push token ready for registration',
        pushRegistration.payload.expoPushToken
      );
    }

    initialized = true;

    return {
      permissionGranted: true,
      pushReady: pushRegistration.status === 'ready',
    };
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
    return { permissionGranted: false, pushReady: false };
  }
}

export function resetNotificationInitialization(): void {
  initialized = false;
}
