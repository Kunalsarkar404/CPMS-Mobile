import { useRouter } from 'expo-router';

import type { NavItem } from '@/constants/navigation';
import { getNavRoute } from '@/constants/navigation';

export function useSidebarNavigation() {
  const router = useRouter();

  const handleSidebarItem = (item: NavItem) => {
    const route = getNavRoute(item.id) ?? item.route;
    if (!route) return;
    router.replace(route);
  };

  return { handleSidebarItem };
}
