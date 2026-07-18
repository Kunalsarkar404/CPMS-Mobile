import { Pressable, View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export default function AppHeader({
  onMenuPress,
  onSearchPress,
  onProfilePress,
}: AppHeaderProps) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5B8C3E" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <Pressable style={styles.iconButton} hitSlop={8} onPress={onMenuPress}>
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </Pressable>
          <View style={styles.actions}>
            <Pressable style={styles.iconButton} hitSlop={8} onPress={onSearchPress}>
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.iconButton} hitSlop={8} onPress={onProfilePress}>
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#5B8C3E',
  },
  container: {
    backgroundColor: '#5B8C3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
