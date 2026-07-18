import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '@/hooks';

export default function ModalScreen() {
  const router = useRouter();
  const { themeMode } = useAppSelector((state) => state.app);
  const isDarkMode = themeMode === 'dark';

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Modal</Text>
      <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
        This is an example modal screen. You can use modals for forms,
        confirmations, or detail views.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.dismissButton,
          pressed && styles.dismissButtonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.dismissButtonText}>Dismiss</Text>
      </Pressable>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  descriptionDark: {
    color: '#9CA3AF',
  },
  dismissButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  dismissButtonPressed: {
    backgroundColor: '#4338CA',
  },
  dismissButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
