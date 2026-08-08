import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import PullToRefreshControl from '@/components/PullToRefreshControl';
import Sidebar from '@/components/Sidebar';
import SmoothScrollView from '@/components/SmoothScrollView';
import { usePullToRefresh } from '@/hooks';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import * as bmiApi from '@/services/crew/bmiApi';
import type { BmiAttachment, BmiRagStatus, CrewBmiView } from '@/services/crew/bmiApi';

// Download control for a reading's attachments. Downloads every file for that
// reading in turn; shows a spinner while running and a tick when done.
function BmiAttachmentCell({ attachments }: { attachments: BmiAttachment[] }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (attachments.length === 0) {
    return <Text style={styles.noAttachment}>—</Text>;
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      for (const attachment of attachments) {
        await bmiApi.downloadBmiFile(attachment);
      }
      setDownloaded(true);
      Alert.alert(
        'Downloaded',
        attachments.length === 1
          ? `“${attachments[0].originalName}” was saved to your device${
              Platform.OS === 'android' ? ' (Download folder)' : ' (Files app)'
            }.`
          : `${attachments.length} files were saved to your device${
              Platform.OS === 'android' ? ' (Download folder)' : ' (Files app)'
            }.`
      );
    } catch (err) {
      console.error('[downloadBmiFile]', err);
      Alert.alert(
        'Download failed',
        err instanceof Error ? err.message : 'Could not download the attachment.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Pressable
      style={styles.attachButton}
      onPress={handleDownload}
      disabled={downloading}
      accessibilityLabel={`Download ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`}
    >
      {downloading ? (
        <ActivityIndicator size="small" color="#12677A" />
      ) : (
        <Ionicons
          name={downloaded ? 'checkmark-circle' : 'download-outline'}
          size={18}
          color={downloaded ? '#16A34A' : '#12677A'}
        />
      )}
      {attachments.length > 1 && <Text style={styles.attachCount}>{attachments.length}</Text>}
    </Pressable>
  );
}

// RAG status -> the label + swatch colour the screen renders (matches the web
// BMI_RAG_INDICATOR colours).
const RAG_META: Record<BmiRagStatus, { label: string; color: string }> = {
  green: { label: 'Healthy', color: '#65B33B' },
  amber: { label: 'Review', color: '#E1D71C' },
  red: { label: 'Action required', color: '#E60012' },
};

function formatDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

export default function MyBmiScreen() {
  const router = useRouter();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [view, setView] = useState<CrewBmiView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadBmi = useCallback(async () => {
    try {
      const data = await bmiApi.getMyBmi();
      setView(data);
      setLoadError(null);
    } catch (err) {
      console.error('[getMyBmi]', err);
      setLoadError(err instanceof Error ? err.message : 'Failed to load BMI history');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      await loadBmi();
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [loadBmi]);

  const { refreshing, onRefresh } = usePullToRefresh(loadBmi);

  const filteredReadings = useMemo(() => {
    const readings = view?.readings ?? [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return readings;

    return readings.filter((reading) => {
      const label = RAG_META[reading.status].label.toLowerCase();
      return (
        formatDate(reading.date).includes(normalizedQuery) ||
        reading.bmi.toLowerCase().includes(normalizedQuery) ||
        label.includes(normalizedQuery)
      );
    });
  }, [view, query]);

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <SmoothScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<PullToRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
              <Text style={[styles.headerCell, styles.attachmentCell]}>Attachment</Text>
            </View>

            {isLoading ? (
              <View style={styles.emptyRow}>
                <ActivityIndicator color="#12677A" />
              </View>
            ) : loadError ? (
              <View style={styles.emptyRow}>
                <Text style={styles.errorText}>{loadError}</Text>
              </View>
            ) : (
              <>
                {filteredReadings.map((reading) => {
                  const meta = RAG_META[reading.status];
                  return (
                    <View key={reading.seq} style={styles.tableRow}>
                      <Text style={[styles.bodyCell, styles.dateCell]}>
                        {formatDate(reading.date)}
                      </Text>
                      <Text style={[styles.bodyCell, styles.bmiCell]}>
                        {reading.bmi}
                      </Text>
                      <View style={[styles.bodyCellContainer, styles.statusCell]}>
                        <View
                          style={[styles.statusIndicator, { backgroundColor: meta.color }]}
                          accessibilityLabel={meta.label}
                        />
                      </View>
                      <View style={[styles.bodyCellContainer, styles.attachmentCell]}>
                        <BmiAttachmentCell attachments={reading.attachments} />
                      </View>
                    </View>
                  );
                })}

                {filteredReadings.length === 0 && (
                  <View style={styles.emptyRow}>
                    <Text style={styles.emptyText}>No BMI readings found</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.targetColumn}>
              <Text style={styles.summaryLabel}>My BMI Target</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{view?.targetBmi || '—'}</Text>
              </View>
            </View>

            <View style={styles.reviewColumn}>
              <Text style={styles.summaryLabel}>Next Review</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{formatDate(view?.nextReviewDate ?? null)}</Text>
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
    flex: 1.3,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
  },
  bmiCell: {
    flex: 0.75,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
  },
  statusCell: {
    flex: 0.75,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
  },
  attachmentCell: {
    flex: 1.1,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#12677A',
  },
  noAttachment: {
    color: '#999999',
    fontSize: 15,
  },
  emptyRow: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyText: {
    color: '#737373',
    fontSize: 14,
  },
  errorText: {
    color: '#DC2626',
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
