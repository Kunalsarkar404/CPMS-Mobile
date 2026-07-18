import {
  getScheduledRecords,
  removeScheduledRecord,
  upsertScheduledRecord,
  clearScheduledRecords,
} from './scheduleStore';
import { getNotificationsModule } from './runtime';
import type { NotificationContentInput } from './types';

let handlerConfigured = false;

function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  handlerConfigured = true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return false;

  configureNotificationHandler();

  const current = await Notifications.getPermissionsAsync();
  if (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

async function cancelNativeNotification(notificationId: string): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Already fired or unknown id.
  }
  try {
    await Notifications.dismissNotificationAsync(notificationId);
  } catch {
    // Not currently displayed.
  }
}

export async function cancelNotificationByDedupeKey(
  dedupeKey: string
): Promise<void> {
  const records = await getScheduledRecords();
  const existing = records[dedupeKey];
  if (!existing) return;
  await cancelNativeNotification(existing.notificationId);
  await removeScheduledRecord(dedupeKey);
}

export async function cancelAllTrackedNotifications(): Promise<void> {
  const Notifications = getNotificationsModule();
  const records = await getScheduledRecords();

  await Promise.all(
    Object.values(records).map((record) =>
      cancelNativeNotification(record.notificationId)
    )
  );

  if (Notifications) {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // Ignore when native module unavailable.
    }
  }

  await clearScheduledRecords();
}

/**
 * Presents or schedules a notification with dedupe.
 * - fireAt null / past => present immediately (notification shade / banner)
 * - fireAt future => schedule once for that date
 */
export async function deliverNotification(
  content: NotificationContentInput,
  fireAt: Date | null = null
): Promise<string | null> {
  const Notifications = getNotificationsModule();
  if (!Notifications) {
    return null;
  }

  const permitted = await requestNotificationPermission();
  if (!permitted) {
    return null;
  }

  const records = await getScheduledRecords();
  const existing = records[content.payload.dedupeKey];
  const fireAtIso = fireAt ? fireAt.toISOString() : null;
  const now = Date.now();
  const shouldPresentNow = !fireAt || fireAt.getTime() <= now;

  if (existing) {
    if (existing.deliveredAt && shouldPresentNow) {
      return existing.notificationId;
    }
    if (
      !shouldPresentNow &&
      existing.fireAt === fireAtIso &&
      !existing.deliveredAt
    ) {
      return existing.notificationId;
    }
    await cancelNativeNotification(existing.notificationId);
    await removeScheduledRecord(content.payload.dedupeKey);
  }

  const data = {
    type: content.payload.type,
    route: content.payload.route,
    dedupeKey: content.payload.dedupeKey,
    ...(content.payload.params ?? {}),
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title,
      body: content.body,
      data,
      sound: true,
      ...(content.channelId ? { channelId: content.channelId } : {}),
    },
    trigger: shouldPresentNow
      ? null
      : {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireAt as Date,
          channelId: content.channelId,
        },
  });

  await upsertScheduledRecord({
    dedupeKey: content.payload.dedupeKey,
    notificationId,
    type: content.payload.type,
    fireAt: fireAtIso,
    deliveredAt: shouldPresentNow ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  });

  return notificationId;
}
