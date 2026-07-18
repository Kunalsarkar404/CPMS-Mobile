import type { Href } from 'expo-router';

export type NotificationEventType =
  | 'new_task_assigned'
  | 'task_due_approaching'
  | 'task_overdue'
  | 'pending_360_feedback'
  | 'appraisal_rating_released'
  | 'pip_status_changed'
  | 'pip_next_action'
  | 'disciplinary_outcome'
  | 'new_reward_granted'
  | 'bmi_review_approaching';

export type NotificationChannelId =
  | 'cpms-default'
  | 'cpms-assignments'
  | 'cpms-reminders'
  | 'cpms-reviews'
  | 'cpms-outcomes';

export type NotificationRoute =
  | '/(tabs)/my-tasks'
  | '/(tabs)/task-detail'
  | '/(tabs)/feedback-360'
  | '/(tabs)/feedback-360-provide'
  | '/(tabs)/my-appraisal'
  | '/(tabs)/pip'
  | '/(tabs)/pip-detail'
  | '/(tabs)/disciplinary'
  | '/(tabs)/rewards'
  | '/(tabs)/my-bmi';

export interface NotificationPayload {
  type: NotificationEventType;
  route: NotificationRoute;
  params?: Record<string, string>;
  dedupeKey: string;
}

export interface NotificationContentInput {
  title: string;
  body: string;
  channelId: NotificationChannelId;
  payload: NotificationPayload;
}

export interface ScheduledNotificationRecord {
  dedupeKey: string;
  notificationId: string;
  type: NotificationEventType;
  fireAt: string | null;
  deliveredAt?: string;
  updatedAt: string;
}

export type PushTokenResult =
  | { status: 'ready'; token: string }
  | { status: 'unavailable'; reason: string };

export interface PushTokenRegistrationPayload {
  expoPushToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceName: string | null;
  appVersion: string;
  registeredAt: string;
}

export type NotificationDestination = {
  href: Href;
};
