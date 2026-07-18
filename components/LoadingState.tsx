import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export default function LoadingState({
  message = 'Loading...',
  size = 'large',
  color = '#5B8C3E',
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 12,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});
