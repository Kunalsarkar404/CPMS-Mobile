import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

import { useAppSelector } from '@/hooks/useAppSelector';
import {
  cancelAllTrackedNotifications,
  canUseNativeNotifications,
  getNotificationsModule,
  initializeNotifications,
  resetNotificationInitialization,
  resolveNotificationDestination,
} from '@/services/notifications';

/**
 * Configures foreground presentation listeners and routes notification taps.
 * Also initializes permissions/reminders once the user is authenticated.
 * No-ops on Expo Go Android where expo-notifications cannot be imported safely.
 */
export function useNotificationLifecycle() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const handledResponseIds = useRef(new Set<string>());

  useEffect(() => {
    if (!canUseNativeNotifications()) {
      return;
    }

    const Notifications = getNotificationsModule();
    if (!Notifications) return;

    const navigateFromNotification = (notification: {
      request: {
        identifier: string;
        content: { data?: Record<string, unknown> | unknown };
      };
    }) => {
      const responseId = notification.request.identifier;
      if (handledResponseIds.current.has(responseId)) return;
      handledResponseIds.current.add(responseId);

      const destination = resolveNotificationDestination(notification);
      if (!destination) return;

      router.push(destination.href);
    };

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigateFromNotification(response.notification);
      });

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse?.notification) {
      navigateFromNotification(lastResponse.notification);
      Notifications.clearLastNotificationResponse();
    }

    return () => {
      responseSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isAuthenticated) {
        resetNotificationInitialization();
        return;
      }

      if (cancelled) return;
      await initializeNotifications();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return {
    clearNotificationsOnLogout: cancelAllTrackedNotifications,
  };
}
