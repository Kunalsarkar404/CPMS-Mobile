import type { Href } from 'expo-router';

import type {
  NotificationDestination,
  NotificationEventType,
  NotificationRoute,
} from './types';

const ALLOWED_ROUTES = new Set<NotificationRoute>([
  '/(tabs)/my-tasks',
  '/(tabs)/task-detail',
  '/(tabs)/feedback-360',
  '/(tabs)/feedback-360-provide',
  '/(tabs)/my-appraisal',
  '/(tabs)/pip',
  '/(tabs)/pip-detail',
  '/(tabs)/disciplinary',
  '/(tabs)/rewards',
  '/(tabs)/my-bmi',
]);

const DEFAULT_ROUTE_BY_TYPE: Record<NotificationEventType, NotificationRoute> =
  {
    new_task_assigned: '/(tabs)/my-tasks',
    task_due_approaching: '/(tabs)/task-detail',
    task_overdue: '/(tabs)/task-detail',
    pending_360_feedback: '/(tabs)/feedback-360',
    appraisal_rating_released: '/(tabs)/my-appraisal',
    pip_status_changed: '/(tabs)/pip-detail',
    pip_next_action: '/(tabs)/pip-detail',
    disciplinary_outcome: '/(tabs)/disciplinary',
    new_reward_granted: '/(tabs)/rewards',
    bmi_review_approaching: '/(tabs)/my-bmi',
  };

function isNotificationRoute(value: unknown): value is NotificationRoute {
  return (
    typeof value === 'string' && ALLOWED_ROUTES.has(value as NotificationRoute)
  );
}

function isEventType(value: unknown): value is NotificationEventType {
  return typeof value === 'string' && value in DEFAULT_ROUTE_BY_TYPE;
}

function sanitizeParams(
  data: Record<string, unknown>
): Record<string, string> | undefined {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      key === 'type' ||
      key === 'route' ||
      key === 'dedupeKey' ||
      typeof value !== 'string'
    ) {
      continue;
    }
    params[key] = value;
  }
  return Object.keys(params).length > 0 ? params : undefined;
}

export function resolveNotificationDestination(notification: {
  request: { content: { data?: Record<string, unknown> | unknown } };
}): NotificationDestination | null {
  const rawData = notification.request.content.data;
  const data =
    rawData && typeof rawData === 'object'
      ? (rawData as Record<string, unknown>)
      : {};

  const type = isEventType(data.type) ? data.type : null;
  const route = isNotificationRoute(data.route)
    ? data.route
    : type
      ? DEFAULT_ROUTE_BY_TYPE[type]
      : null;

  if (!route) return null;

  const params = sanitizeParams(data);

  if (params && Object.keys(params).length > 0) {
    return {
      href: {
        pathname: route,
        params,
      } as Href,
    };
  }

  return { href: route as Href };
}
