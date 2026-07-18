import { useNotificationLifecycle } from '@/hooks/useNotificationLifecycle';

/**
 * Mounts notification permission, reminder sync, and tap-routing lifecycle
 * inside the Redux provider tree.
 */
export default function NotificationBootstrap() {
  useNotificationLifecycle();
  return null;
}
