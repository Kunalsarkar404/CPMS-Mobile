import { Redirect, Tabs } from 'expo-router';

import { useAppSelector } from '@/hooks';

export default function TabLayout() {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        animation: 'fade',
        freezeOnBlur: true,
        lazy: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="my-tasks" options={{ title: 'My Tasks', href: null }} />
      <Tabs.Screen
        name="my-appraisal"
        options={{ title: 'My Appraisal', href: null }}
      />
      <Tabs.Screen name="pip" options={{ title: 'PIP', href: null }} />
      <Tabs.Screen
        name="pip-detail"
        options={{ title: 'PIP Detail', href: null }}
      />
      <Tabs.Screen
        name="disciplinary"
        options={{ title: 'Disciplinary', href: null }}
      />
      <Tabs.Screen
        name="disciplinary-detail"
        options={{ title: 'Disciplinary Detail', href: null }}
      />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards', href: null }} />
      <Tabs.Screen
        name="feedback-360"
        options={{ title: '360 Feedback', href: null }}
      />
      <Tabs.Screen
        name="feedback-360-provide"
        options={{ title: 'Provide 360 Feedback', href: null }}
      />
      <Tabs.Screen name="my-bmi" options={{ title: 'My BMI', href: null }} />
      <Tabs.Screen
        name="task-detail"
        options={{ title: 'Task Detail', href: null }}
      />
      <Tabs.Screen
        name="task-success"
        options={{ title: 'Task Success', href: null }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
