import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import SmoothScrollView from '@/components/SmoothScrollView';
import Sidebar from '@/components/Sidebar';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import {
  MOCK_DISCIPLINARY,
  type DisciplinaryFilter,
} from '@/constants/disciplinary';

const STATUS_FILTERS: { id: DisciplinaryFilter; label: string }[] = [
  { id: 'all', label: 'Showing All' },
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
];

export default function DisciplinaryScreen() {
  const router = useRouter();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState<DisciplinaryFilter>('all');
  const [yearOpen, setYearOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'disc-1': true,
    'disc-2': true,
  });

  const years = useMemo(
    () =>
      Array.from(new Set(MOCK_DISCIPLINARY.map((item) => item.year))).sort(
        (a, b) => Number(b) - Number(a)
      ),
    []
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_DISCIPLINARY.filter((item) => {
      const matchesYear = item.year === year;
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.outcome.toLowerCase().includes(q);
      return matchesYear && matchesStatus && matchesQuery;
    });
  }, [query, year, statusFilter]);

  const toggleCard = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          <Text style={styles.heading}>1.6 My Disciplinary File</Text>

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

          <Text style={styles.sectionTitle}>Disciplinary File</Text>

          <View style={styles.filterRow}>
            <View style={styles.dropdownWrapper}>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => {
                  setYearOpen((prev) => !prev);
                  setStatusOpen(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>{year}</Text>
                <Ionicons name="chevron-down" size={14} color="#4B5563" />
              </Pressable>
              {yearOpen && (
                <View style={styles.dropdownMenuYear}>
                  {years.map((itemYear) => (
                    <Pressable
                      key={itemYear}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        pressed && styles.dropdownItemPressed,
                      ]}
                      onPress={() => {
                        setYear(itemYear);
                        setYearOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{itemYear}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.dropdownWrapperFlex}>
              <Pressable
                style={[styles.dropdownButton, styles.dropdownButtonSelfStart]}
                onPress={() => {
                  setStatusOpen((prev) => !prev);
                  setYearOpen(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {STATUS_FILTERS.find((f) => f.id === statusFilter)?.label}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#4B5563" />
              </Pressable>
              {statusOpen && (
                <View style={styles.dropdownMenuStatus}>
                  {STATUS_FILTERS.map((filter) => (
                    <Pressable
                      key={filter.id}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        pressed && styles.dropdownItemPressed,
                      ]}
                      onPress={() => {
                        setStatusFilter(filter.id);
                        setStatusOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {filter.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {filteredItems.map((item) => {
            const isOpen = expanded[item.id] !== false;
            const isStatusOpen = item.status === 'open';

            return (
              <View key={item.id} style={styles.card}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cardHeader,
                    pressed && styles.cardHeaderPressed,
                  ]}
                  onPress={() => toggleCard(item.id)}
                >
                  <Text style={styles.cardTitle}>
                    {item.code} - {item.title}
                  </Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>

                {isOpen && (
                  <View style={styles.cardBody}>
                    <Text style={styles.fieldLabel}>Description:</Text>
                    <Text style={styles.descriptionText}>
                      {item.description}
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.metaRow}>
                      <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Owner Name</Text>
                        <Text style={styles.metaValueBold}>
                          {item.ownerName}
                        </Text>
                      </View>
                      <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Open Date</Text>
                        <Text style={styles.metaValue}>
                          {item.openDate}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.outcomeRow}>
                      <View style={styles.outcomeCol}>
                        <Text style={styles.metaLabel}>Outcome</Text>
                        <Text style={styles.metaValue}>{item.outcome}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          isStatusOpen
                            ? styles.statusBadgeOpen
                            : styles.statusBadgeClosed,
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: isStatusOpen
                                ? '#DC2626'
                                : '#16A34A',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            isStatusOpen
                              ? styles.statusTextOpen
                              : styles.statusTextClosed,
                          ]}
                        >
                          {isStatusOpen ? 'Open' : 'Closed'}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={({ pressed }) => [
                        styles.attachmentButton,
                        pressed && styles.attachmentButtonPressed,
                      ]}
                      onPress={() =>
                        Alert.alert(
                          'Attachment',
                          `Opening attachment for ${item.code}.`
                        )
                      }
                    >
                      <Ionicons name="attach" size={16} color="#6B7280" />
                      <Text style={styles.attachmentText}>Attachment</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>
                No disciplinary records found
              </Text>
            </View>
          )}
        </View>
      </SmoothScrollView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.5"
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C5271',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownWrapperFlex: {
    position: 'relative',
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dropdownButtonSelfStart: {
    alignSelf: 'flex-start',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  dropdownMenuYear: {
    position: 'absolute',
    top: 44,
    left: 0,
    minWidth: 90,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
  },
  dropdownMenuStatus: {
    position: 'absolute',
    top: 44,
    left: 0,
    minWidth: 140,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardHeaderPressed: {
    backgroundColor: '#F9FAFB',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingRight: 8,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metaValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  metaValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  outcomeCol: {
    flex: 1,
    paddingRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeOpen: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeClosed: {
    backgroundColor: '#DCFCE7',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextOpen: {
    color: '#DC2626',
  },
  statusTextClosed: {
    color: '#15803D',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachmentButtonPressed: {
    backgroundColor: '#F9FAFB',
  },
  attachmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
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
