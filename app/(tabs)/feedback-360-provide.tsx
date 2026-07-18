import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import ConfirmModal from '@/components/ConfirmModal';
import Sidebar from '@/components/Sidebar';
import SmoothScrollView from '@/components/SmoothScrollView';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import {
  getGiveFeedbackById,
  type GiveFeedbackCrewMember,
} from '@/constants/feedback360';

function StarRating({
  value,
  editable = false,
  onChange,
}: {
  value: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          disabled={!editable}
          onPress={() => onChange?.(star)}
          hitSlop={4}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={22}
            color={star <= value ? '#5B8C3E' : '#9CA3AF'}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function Provide360FeedbackScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [expandedCrew, setExpandedCrew] = useState<Record<string, boolean>>({});
  const [crewData, setCrewData] = useState<GiveFeedbackCrewMember[]>([]);

  const item = useMemo(
    () => getGiveFeedbackById(id ?? 'give-1') ?? getGiveFeedbackById('give-1')!,
    [id]
  );

  useEffect(() => {
    setCrewData(
      item.crew.map((member) => ({
        ...member,
        ratings: [...member.ratings],
      }))
    );
    setEditingId(null);
  }, [item]);

  const isExpanded = (crewId: string) => expandedCrew[crewId] !== false;

  const toggleCrew = (crewId: string) => {
    setExpandedCrew((prev) => ({
      ...prev,
      [crewId]: !(prev[crewId] !== false),
    }));
  };

  const updateRating = (crewId: string, kpiIndex: number, rating: number) => {
    setCrewData((prev) =>
      prev.map((member) => {
        if (member.id !== crewId) return member;
        const ratings = [...member.ratings];
        ratings[kpiIndex] = rating;
        return { ...member, ratings };
      })
    );
  };

  const updateComments = (crewId: string, comments: string) => {
    setCrewData((prev) =>
      prev.map((member) =>
        member.id === crewId ? { ...member, comments } : member
      )
    );
  };

  const handleSavePress = () => {
    setConfirmVisible(true);
  };

  const confirmSave = () => {
    setConfirmVisible(false);
    setEditingId(null);
    router.replace({
      pathname: '/(tabs)/feedback-360',
      params: { mode: 'give' },
    });
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
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <View style={styles.backIconBox}>
              <Ionicons name="chevron-back" size={18} color="#6B7280" />
            </View>
            <Text style={styles.backText}>Go Back</Text>
          </Pressable>

          <Text style={styles.title}>Provide 360 Feedback</Text>

          <View style={styles.summaryCard}>
            <Pressable
              style={styles.summaryHeader}
              onPress={() => setSummaryExpanded((prev) => !prev)}
            >
              <Text style={styles.summaryTitle}>{item.code}</Text>
              <Ionicons
                name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#6B7280"
              />
            </Pressable>

            {summaryExpanded && (
              <>
                <View style={styles.summaryMetaRow}>
                  <View style={styles.summaryMetaCol}>
                    <Text style={styles.summaryMetaText}>
                      Date: {item.dated}
                    </Text>
                  </View>
                  <View style={styles.summaryMetaCol}>
                    <Text style={styles.summaryMetaText}>
                      Original Destination: {item.destination}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {item.status}.
                  </Text>
                </View>
              </>
            )}
          </View>

          {crewData.map((member) => {
            const editing = editingId === member.id;
            const expanded = isExpanded(member.id);

            return (
              <View key={member.id} style={styles.crewCard}>
                <Pressable
                  style={styles.crewHeader}
                  onPress={() => toggleCrew(member.id)}
                >
                  <Text style={styles.crewName}>
                    {member.name} - {member.grade}
                  </Text>
                  {!editing && (
                    <Pressable
                      style={styles.editButton}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        setEditingId(member.id);
                        setExpandedCrew((prev) => ({
                          ...prev,
                          [member.id]: true,
                        }));
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                  )}
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>

                {expanded && (
                  <View style={styles.crewBody}>
                    {[0, 1, 2, 3].map((kpiIndex) => (
                      <View
                        key={`${member.id}-kpi-${kpiIndex}`}
                        style={styles.kpiRow}
                      >
                        <Text style={styles.kpiLabel}>
                          KPI {kpiIndex + 1}
                        </Text>
                        <StarRating
                          value={member.ratings[kpiIndex] ?? 0}
                          editable={editing}
                          onChange={(rating) =>
                            updateRating(member.id, kpiIndex, rating)
                          }
                        />
                      </View>
                    ))}

                    <Text style={styles.commentsLabel}>Comments:</Text>
                    {editing ? (
                      <TextInput
                        style={styles.commentsInput}
                        multiline
                        textAlignVertical="top"
                        value={
                          member.comments === 'N/A' ? '' : member.comments
                        }
                        onChangeText={(text) =>
                          updateComments(member.id, text)
                        }
                        placeholder="Type your comments"
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={styles.commentsText}>
                        {member.comments}
                      </Text>
                    )}

                    {editing && (
                      <View style={styles.editActions}>
                        <Pressable
                          style={styles.cancelButton}
                          onPress={() => setEditingId(null)}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={styles.saveButton}
                          onPress={handleSavePress}
                        >
                          <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </SmoothScrollView>

      <ConfirmModal
        visible={confirmVisible}
        title="Are you sure you want to save and submit the feedback?"
        confirmLabel="Yes, Save"
        cancelLabel="No, Cancel"
        onConfirm={confirmSave}
        onCancel={() => setConfirmVisible(false)}
      />

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.7"
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
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  summaryMetaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryMetaCol: {
    flex: 1,
  },
  summaryMetaText: {
    fontSize: 14,
    color: '#4B5563',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDE047',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  crewCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  crewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  crewName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    marginRight: 12,
  },
  editButtonText: {
    fontSize: 14,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  crewBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 14,
    color: '#374151',
    width: 64,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 80,
    marginBottom: 12,
  },
  commentsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#5B8C3E',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
