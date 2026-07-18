import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import SmoothScrollView from '@/components/SmoothScrollView';
import {
  NAV_SECTIONS,
  type NavItem,
  type NavSection,
} from '@/constants/navigation';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.82, 320);

const OPEN_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const CLOSE_CONFIG = {
  duration: 240,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

/** @deprecated Prefer NavItem from @/constants/navigation */
export type SidebarItem = NavItem;
/** @deprecated Prefer NavSection from @/constants/navigation */
export type SidebarSection = NavSection;
/** @deprecated Prefer NAV_SECTIONS from @/constants/navigation */
export const SIDEBAR_SECTIONS = NAV_SECTIONS;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  activeItemId?: string;
  onItemPress?: (item: NavItem) => void;
}

export default function Sidebar({
  visible,
  onClose,
  activeItemId = '1.1',
  onItemPress,
}: SidebarProps) {
  const [mounted, setMounted] = useState(visible);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({ 'crew-self-service': true });
  const pendingItemRef = useRef<NavItem | null>(null);
  const onItemPressRef = useRef(onItemPress);
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  onItemPressRef.current = onItemPress;

  const finishClose = () => {
    setMounted(false);
    const pending = pendingItemRef.current;
    pendingItemRef.current = null;
    if (pending) {
      onItemPressRef.current?.(pending);
    }
  };

  useEffect(() => {
    if (visible) {
      pendingItemRef.current = null;
      setMounted(true);
      translateX.value = withTiming(0, OPEN_CONFIG);
      overlayOpacity.value = withTiming(0.45, OPEN_CONFIG);
    } else if (mounted) {
      translateX.value = withTiming(-DRAWER_WIDTH, CLOSE_CONFIG);
      overlayOpacity.value = withTiming(0, CLOSE_CONFIG, (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      });
    }
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleItemPress = (item: NavItem) => {
    if (item.id === activeItemId) {
      onClose();
      return;
    }
    pendingItemRef.current = item;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.drawer, { width: DRAWER_WIDTH }, drawerStyle]}
        >
          <SafeAreaView edges={['top', 'bottom']} style={styles.drawerSafeArea}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Menu</Text>
            </View>
            <View style={styles.divider} />

            <SmoothScrollView
              style={styles.scrollView}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              {NAV_SECTIONS.map((section) => {
                const isExpanded = expandedSections[section.id];
                return (
                  <View key={section.id} style={styles.section}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.sectionHeader,
                        pressed && styles.pressedItem,
                      ]}
                      onPress={() => toggleSection(section.id)}
                    >
                      <Ionicons name={section.icon} size={22} color="#FFFFFF" />
                      <Text style={styles.sectionLabel}>{section.label}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                        size={18}
                        color="#FFFFFF"
                      />
                    </Pressable>

                    {isExpanded &&
                      section.items.map((item) => {
                        const isActive = activeItemId === item.id;
                        return (
                          <Pressable
                            key={item.id}
                            style={({ pressed }) => [
                              styles.item,
                              (pressed || isActive) && styles.pressedItem,
                            ]}
                            onPress={() => handleItemPress(item)}
                          >
                            <Text
                              style={[
                                styles.itemLabel,
                                isActive && styles.itemLabelActive,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                  </View>
                );
              })}
            </SmoothScrollView>
          </SafeAreaView>
        </Animated.View>

        <Pressable style={styles.overlayPressable} onPress={onClose}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    height: '100%',
    backgroundColor: '#1C1C1E',
    zIndex: 10,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 0 },
  },
  drawerSafeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sectionLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  item: {
    paddingLeft: 56,
    paddingRight: 20,
    paddingVertical: 10,
  },
  itemLabel: {
    fontSize: 15,
    color: '#D1D5DB',
  },
  itemLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pressedItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  overlayPressable: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
