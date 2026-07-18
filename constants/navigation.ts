import type { Href } from 'expo-router';
import type { Ionicons } from '@expo/vector-icons';

export interface NavItem {
  id: string;
  label: string;
  route: Href;
}

export interface NavSection {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: NavItem[];
}

/**
 * Single source of truth for sidebar sections and Expo Router destinations.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'crew-self-service',
    label: '1. Crew Self Service',
    icon: 'people',
    items: [
      { id: '1.1', label: '1.1 Dashboard', route: '/(tabs)' },
      {
        id: '1.2',
        label: '1.2 My Tasks & Notifications',
        route: '/(tabs)/my-tasks',
      },
      { id: '1.3', label: '1.3 My Appraisal', route: '/(tabs)/my-appraisal' },
      { id: '1.4', label: '1.4 PIP', route: '/(tabs)/pip' },
      {
        id: '1.5',
        label: '1.5 My Disciplinary',
        route: '/(tabs)/disciplinary',
      },
      { id: '1.6', label: '1.6 My Rewards', route: '/(tabs)/rewards' },
      {
        id: '1.7',
        label: '1.7 360 Feedback',
        route: '/(tabs)/feedback-360',
      },
      { id: '1.8', label: '1.8 My BMI', route: '/(tabs)/my-bmi' },
    ],
  },
];

export const NAV_ROUTES: Record<string, Href> = Object.fromEntries(
  NAV_SECTIONS.flatMap((section) =>
    section.items.map((item) => [item.id, item.route])
  )
) as Record<string, Href>;

export function getNavRoute(itemId: string): Href | undefined {
  return NAV_ROUTES[itemId];
}
