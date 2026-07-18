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
import { useAppSelector } from '@/hooks';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

interface Reward {
  id: string;
  code: string;
  type: string;
  date: string;
}

const MOCK_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    code: 'ATTN',
    type: 'Attendance',
    date: '19-03-2026',
  },
  {
    id: 'reward-2',
    code: 'SAFE',
    type: 'Safety Excellence',
    date: '02-05-2026',
  },
  {
    id: 'reward-3',
    code: 'CUST',
    type: 'Customer Service',
    date: '14-08-2026',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const { selectedStaff } = useAppSelector((state) => state.auth);
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [year] = useState('2026');

  const staffLabel = selectedStaff
    ? `${selectedStaff.id} | ${selectedStaff.name}`
    : 'CP 5785 | Jacob Taylor';

  const filteredRewards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_REWARDS;
    return MOCK_REWARDS.filter(
      (reward) =>
        reward.code.toLowerCase().includes(q) ||
        reward.type.toLowerCase().includes(q) ||
        reward.date.includes(q)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <SmoothScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            1.5 Crew Self Service - Rewards
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
        </View>

        <View style={styles.content}>
          <Pressable style={styles.yearButton}>
            <Text style={styles.yearText}>{year}</Text>
            <Ionicons name="chevron-down" size={14} color="#4B5563" />
          </Pressable>

          <Text style={styles.staffTitle}>
            {staffLabel} - Rewards
          </Text>

          {filteredRewards.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <Text style={styles.rewardCode}>{reward.code}</Text>

              <View style={styles.rewardDetails}>
                <View style={styles.rewardField}>
                  <Text style={styles.fieldLabel}>Type:</Text>
                  <Text style={styles.fieldValue}>{reward.type}</Text>
                </View>
                <View style={styles.rewardField}>
                  <Text style={styles.fieldLabel}>Date:</Text>
                  <Text style={styles.fieldValue}>{reward.date}</Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.downloadButton,
                  pressed && styles.downloadButtonPressed,
                ]}
                onPress={() =>
                  Alert.alert(
                    'Download Letter',
                    `${reward.code} letter download started.`
                  )
                }
              >
                <Ionicons name="download-outline" size={18} color="#374151" />
                <Text style={styles.downloadText}>Download Letter</Text>
              </Pressable>
            </View>
          ))}

          {filteredRewards.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No rewards found</Text>
            </View>
          )}
        </View>
      </SmoothScrollView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.6"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  yearText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  staffTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C70',
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  rewardCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  rewardDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rewardField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  downloadButtonPressed: {
    backgroundColor: '#F9FAFB',
  },
  downloadText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
});
