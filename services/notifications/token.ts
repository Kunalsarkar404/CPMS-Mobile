import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

import { getNotificationsModule, canUseNativeNotifications } from './runtime';
import type {
  PushTokenRegistrationPayload,
  PushTokenResult,
} from './types';

function resolveProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId
  );
}

/**
 * Obtains an Expo push token when the device and project are ready.
 * Does not invent or call a backend registration endpoint.
 */
export async function getExpoPushTokenReady(): Promise<PushTokenResult> {
  if (Platform.OS === 'web') {
    return { status: 'unavailable', reason: 'web_unsupported' };
  }

  if (!canUseNativeNotifications()) {
    return { status: 'unavailable', reason: 'expo_go_android_unsupported' };
  }

  if (!Device.isDevice) {
    return { status: 'unavailable', reason: 'simulator_or_emulator' };
  }

  const projectId = resolveProjectId();
  if (!projectId) {
    return { status: 'unavailable', reason: 'missing_eas_project_id' };
  }

  const Notifications = getNotificationsModule();
  if (!Notifications) {
    return { status: 'unavailable', reason: 'module_unavailable' };
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    if (!token.data) {
      return { status: 'unavailable', reason: 'empty_token' };
    }
    return { status: 'ready', token: token.data };
  } catch (error) {
    console.warn('Unable to get Expo push token:', error);
    return { status: 'unavailable', reason: 'token_request_failed' };
  }
}

/**
 * Builds the payload a future backend would accept.
 * Intentionally does not POST anywhere yet.
 */
export function buildPushTokenRegistrationPayload(
  expoPushToken: string
): PushTokenRegistrationPayload {
  return {
    expoPushToken,
    platform:
      Platform.OS === 'ios'
        ? 'ios'
        : Platform.OS === 'android'
          ? 'android'
          : 'web',
    deviceName: Device.deviceName,
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    registeredAt: new Date().toISOString(),
  };
}

export async function preparePushTokenRegistration(): Promise<
  | { status: 'ready'; payload: PushTokenRegistrationPayload }
  | { status: 'unavailable'; reason: string }
> {
  const tokenResult = await getExpoPushTokenReady();
  if (tokenResult.status !== 'ready') {
    return tokenResult;
  }

  return {
    status: 'ready',
    payload: buildPushTokenRegistrationPayload(tokenResult.token),
  };
}
