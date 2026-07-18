import { Platform } from 'react-native';

import { getNotificationsModule } from './runtime';
import type { NotificationChannelId } from './types';

const CHANNELS: {
  id: NotificationChannelId;
  name: string;
  description: string;
}[] = [
  {
    id: 'cpms-default',
    name: 'CPMS',
    description: 'General Crew Performance Management notifications',
  },
  {
    id: 'cpms-assignments',
    name: 'Assignments',
    description: 'New task and reward assignments',
  },
  {
    id: 'cpms-reminders',
    name: 'Reminders',
    description: 'Due dates, pending feedback, and review reminders',
  },
  {
    id: 'cpms-reviews',
    name: 'Reviews',
    description: 'Appraisal ratings and review updates',
  },
  {
    id: 'cpms-outcomes',
    name: 'Outcomes',
    description: 'Disciplinary and PIP status outcomes',
  },
];

export async function ensureNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Promise.all(
    CHANNELS.map((channel) =>
      Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        description: channel.description,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5B8C3E',
      })
    )
  );
}
