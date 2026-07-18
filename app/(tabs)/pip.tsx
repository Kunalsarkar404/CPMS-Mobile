import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import SmoothScrollView from '@/components/SmoothScrollView';
import Sidebar from '@/components/Sidebar';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { MOCK_PIPS, type PipStatus } from '@/constants/pip';

export default function PipListScreen() {
  const router = useRouter();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PipStatus>('open');
  const [year] = useState('2026');

  const filteredPips = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PIPS.filter((pip) => {
      const matchesStatus = pip.status === statusFilter;
      const matchesYear = pip.appraisalYear === year || statusFilter === 'closed';
      const matchesQuery =
        !q ||
        pip.code.toLowerCase().includes(q) ||
        pip.nextActionDate.includes(q);
      return matchesStatus && matchesQuery && (statusFilter === 'open' ? matchesYear : true);
    });
  }, [query, statusFilter, year]);

  return (
    <View style={styles.screen}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <SmoothScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.heading}>
            1.4 Crew Self Service - PIP
          </Text>

          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <View style={styles.statusFilterRow}>
            {(['open', 'closed'] as PipStatus[]).map((status) => {
              const selected = statusFilter === status;
              return (
                <Pressable
                  key={status}
                  style={styles.statusOption}
                  onPress={() => setStatusFilter(status)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected ? styles.radioOuterSelected : styles.radioOuterDefault,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.statusLabel,
                      selected ? styles.statusLabelSelected : styles.statusLabelDefault,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              List of {statusFilter === 'open' ? 'Open' : 'Closed'} PIP&apos;s
            </Text>
            <Pressable style={styles.yearButton}>
              <Text style={styles.yearButtonText}>{year}</Text>
              <Ionicons name="chevron-down" size={14} color="#4B5563" />
            </Pressable>
          </View>

          {filteredPips.map((pip) => (
            <Pressable
              key={pip.id}
              style={({ pressed }) => [
                styles.pipCard,
                pressed && styles.pipCardPressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/pip-detail',
                  params: { id: pip.id },
                })
              }
            >
              <View style={styles.pipCardContent}>
                <Text style={styles.pipCode}>{pip.code}</Text>
                <Text style={styles.pipDate}>
                  Next Action Date: {pip.nextActionDate}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>
          ))}

          {filteredPips.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No PIPs found</Text>
            </View>
          )}
        </View>
      </SmoothScrollView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.4"
        onItemPress={handleSidebarItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  statusFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#2563EB',
  },
  radioOuterDefault: {
    borderColor: '#9CA3AF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  statusLabel: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  statusLabelSelected: {
    color: '#111827',
    fontWeight: '500',
  },
  statusLabelDefault: {
    color: '#4B5563',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C5271',
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  yearButtonText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  pipCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipCardPressed: {
    backgroundColor: '#F9FAFB',
  },
  pipCardContent: {
    flex: 1,
  },
  pipCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pipDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
});
