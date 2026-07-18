import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  fullScreen?: boolean;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
  retryLabel = 'Retry',
  fullScreen = false,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
    gap: 8,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  iconWrap: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonPressed: {
    backgroundColor: '#4A7332',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
