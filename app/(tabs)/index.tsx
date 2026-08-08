import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import { useAppSelector } from '@/hooks';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

export default function DashboardScreen() {
  const router = useRouter();
  const { staffSession } = useAppSelector((state) => state.auth);
  const { handleSidebarItem } = useSidebarNavigation();
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          1. Crew Self Service Dashboard
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {staffSession && (
          <View style={styles.staffCard}>
            <Text style={styles.staffLabel}>Logged in as</Text>
            <Text style={styles.staffName}>
              {staffSession.fullName}
            </Text>
            <Text style={styles.staffMeta}>{staffSession.staffId}</Text>
          </View>
        )}
      </View>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.1"
        onItemPress={handleSidebarItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  staffCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  staffLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  staffMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
