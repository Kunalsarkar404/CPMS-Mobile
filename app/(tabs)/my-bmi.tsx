import { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import SmoothScrollView from '@/components/SmoothScrollView';
import {
  BMI_NEXT_REVIEW_DATE,
  BMI_READINGS,
  BMI_TARGET,
} from '@/constants/bmi';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

export default function MyBmiScreen() {
  const router = useRouter();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredReadings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return BMI_READINGS;

    return BMI_READINGS.filter(
      (reading) =>
        reading.date.includes(normalizedQuery) ||
        reading.bmi.includes(normalizedQuery) ||
        reading.statusLabel.toLowerCase().includes(normalizedQuery)
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
          <Text style={styles.title}>1.8 My BMI</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color="#737373" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#737373"
              value={query}
              onChangeText={setQuery}
              accessibilityLabel="Search BMI history"
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>My BMI History</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.headerCell, styles.dateCell]}>
                Reading Date
              </Text>
              <Text style={[styles.headerCell, styles.bmiCell]}>BMI</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
            </View>

            {filteredReadings.map((reading) => (
              <View key={reading.id} style={styles.tableRow}>
                <Text style={[styles.bodyCell, styles.dateCell]}>
                  {reading.date}
                </Text>
                <Text style={[styles.bodyCell, styles.bmiCell]}>
                  {reading.bmi}
                </Text>
                <View style={[styles.bodyCellContainer, styles.statusCell]}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: reading.statusColor },
                    ]}
                    accessibilityLabel={reading.statusLabel}
                  />
                </View>
              </View>
            ))}

            {filteredReadings.length === 0 && (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No BMI readings found</Text>
              </View>
            )}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.targetColumn}>
              <Text style={styles.summaryLabel}>My BMI Target</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{BMI_TARGET}</Text>
              </View>
            </View>

            <View style={styles.reviewColumn}>
              <Text style={styles.summaryLabel}>Next Review</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{BMI_NEXT_REVIEW_DATE}</Text>
              </View>
            </View>
          </View>
        </View>
      </SmoothScrollView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.8"
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    color: '#151515',
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    color: '#292929',
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#12677A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
  },
  tableRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  tableHeader: {
    minHeight: 40,
    backgroundColor: '#12677A',
  },
  headerCell: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 9,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  bodyCell: {
    paddingHorizontal: 5,
    paddingVertical: 6,
    color: '#666666',
    fontSize: 15,
  },
  bodyCellContainer: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  dateCell: {
    flex: 1.45,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
  },
  bmiCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
  },
  statusCell: {
    flex: 0.95,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  emptyRow: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyText: {
    color: '#737373',
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 28,
    marginTop: 36,
  },
  targetColumn: {
    flex: 0.8,
  },
  reviewColumn: {
    flex: 1.35,
  },
  summaryLabel: {
    color: '#555555',
    fontSize: 16,
    marginBottom: 10,
  },
  summaryCard: {
    minHeight: 88,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  summaryValue: {
    color: '#111111',
    fontSize: 28,
    fontWeight: '700',
  },
});
