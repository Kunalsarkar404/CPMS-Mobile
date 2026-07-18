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
import AppraisalAccordion from '@/components/AppraisalAccordion';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import {
  APPRAISAL_TABS,
  LOREM,
  MOCK_OBJECTIVES,
  type AppraisalTab,
} from '@/constants/appraisal';

type ExpandedMap = Record<string, boolean>;

export default function MyAppraisalScreen() {
  const router = useRouter();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AppraisalTab>('objectives');
  const [year] = useState('2026');
  const [objectiveIndex, setObjectiveIndex] = useState(0);
  const [editingCrew, setEditingCrew] = useState(false);
  const [crewCommentDraft, setCrewCommentDraft] = useState('');
  const [annualCrewComment, setAnnualCrewComment] = useState('');
  const [expanded, setExpanded] = useState<ExpandedMap>({
    objectives: true,
    crew: true,
    appraiser: true,
    midCrew: true,
    midAppraiser: true,
    midRating: true,
    annualCrew: true,
    annualAppraiser: true,
    annualRating: true,
  });

  const currentObjective = MOCK_OBJECTIVES[objectiveIndex];

  const filteredObjectives = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_OBJECTIVES;
    return MOCK_OBJECTIVES.filter(
      (obj) =>
        obj.category.toLowerCase().includes(q) ||
        obj.title.toLowerCase().includes(q) ||
        obj.description.toLowerCase().includes(q)
    );
  }, [query]);

  const displayObjective =
    filteredObjectives[Math.min(objectiveIndex, filteredObjectives.length - 1)] ??
    currentObjective;

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const goPrev = () => {
    setObjectiveIndex((prev) => Math.max(0, prev - 1));
    setEditingCrew(false);
  };

  const goNext = () => {
    setObjectiveIndex((prev) =>
      Math.min(MOCK_OBJECTIVES.length - 1, prev + 1)
    );
    setEditingCrew(false);
  };

  const startEditCrew = () => {
    setCrewCommentDraft(displayObjective.crewComments);
    setEditingCrew(true);
  };

  const saveCrewComments = () => {
    displayObjective.crewComments = crewCommentDraft;
    setEditingCrew(false);
    Alert.alert('Saved', 'Crew comments updated.');
  };

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
        <View style={styles.content}>
          <Text style={styles.title}>
            1.2 Crew Self Service - My Appraisal
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

          <View style={styles.tabRow}>
            {APPRAISAL_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[
                    styles.tab,
                    isActive ? styles.tabActive : styles.tabInactive,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive ? styles.tabTextActive : styles.tabTextInactive,
                    ]}
                    numberOfLines={2}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'objectives' && (
            <>
              <Pressable style={styles.yearButton}>
                <Text style={styles.yearText}>{year}</Text>
                <Ionicons name="chevron-down" size={14} color="#4B5563" />
              </Pressable>

              <View style={styles.objectiveHeader}>
                <Text style={styles.objectiveTitle}>
                  Objective {objectiveIndex + 1} of {MOCK_OBJECTIVES.length}
                </Text>
                <View style={styles.objectiveNav}>
                  <Pressable
                    onPress={goPrev}
                    disabled={objectiveIndex === 0}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={objectiveIndex === 0 ? '#D1D5DB' : '#005C70'}
                    />
                  </Pressable>
                  <Pressable
                    onPress={goNext}
                    disabled={objectiveIndex === MOCK_OBJECTIVES.length - 1}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color={
                        objectiveIndex === MOCK_OBJECTIVES.length - 1
                          ? '#D1D5DB'
                          : '#005C70'
                      }
                    />
                  </Pressable>
                </View>
              </View>

              <Text style={styles.category}>
                {displayObjective.category}
              </Text>

              <AppraisalAccordion
                title={displayObjective.title}
                expanded={expanded.objectives}
                onToggle={() => toggle('objectives')}
              >
                <Text style={styles.bodyText}>
                  {displayObjective.description}
                </Text>
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Crew Comments"
                expanded={expanded.crew}
                onToggle={() => toggle('crew')}
                onEdit={editingCrew ? undefined : startEditCrew}
              >
                {editingCrew ? (
                  <View>
                    <TextInput
                      style={styles.commentInput}
                      multiline
                      textAlignVertical="top"
                      value={crewCommentDraft}
                      onChangeText={setCrewCommentDraft}
                    />
                    <View style={styles.editActions}>
                      <Pressable
                        style={styles.cancelButton}
                        onPress={() => setEditingCrew(false)}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={styles.saveButton}
                        onPress={saveCrewComments}
                      >
                        <Text style={styles.saveText}>Save</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.bodyText}>
                    {displayObjective.crewComments}
                  </Text>
                )}
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Appraiser Comments"
                expanded={expanded.appraiser}
                onToggle={() => toggle('appraiser')}
              >
                <Text style={styles.bodyText}>
                  {displayObjective.appraiserComments}
                </Text>
              </AppraisalAccordion>

              <View style={styles.navButtons}>
                {objectiveIndex > 0 && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.prevButton,
                      pressed && styles.prevButtonPressed,
                    ]}
                    onPress={goPrev}
                  >
                    <Text style={styles.prevButtonText}>Previous</Text>
                  </Pressable>
                )}
                {objectiveIndex < MOCK_OBJECTIVES.length - 1 && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.nextButton,
                      pressed && styles.nextButtonPressed,
                    ]}
                    onPress={goNext}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {activeTab === 'mid_year' && (
            <>
              <Text style={styles.reviewTitle}>Mid Year Review</Text>

              <Pressable style={styles.attachmentButton}>
                <Ionicons name="attach" size={16} color="#6B7280" />
                <Text style={styles.attachmentText}>Attachment</Text>
              </Pressable>

              <AppraisalAccordion
                title="Appraise Comments (Crew)"
                expanded={expanded.midCrew}
                onToggle={() => toggle('midCrew')}
                onEdit={() =>
                  Alert.alert('Edit', 'Crew mid-year comments editing.')
                }
              >
                <Text style={styles.bodyText}>{LOREM}</Text>
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Appraise Comments"
                expanded={expanded.midAppraiser}
                onToggle={() => toggle('midAppraiser')}
              >
                <Text style={styles.bodyText}>{LOREM}</Text>
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Final Rating"
                expanded={expanded.midRating}
                onToggle={() => toggle('midRating')}
              >
                <Text style={styles.naText}>N/A</Text>
              </AppraisalAccordion>
            </>
          )}

          {activeTab === 'annual_year' && (
            <>
              <Text style={styles.reviewTitle}>Annual Year Review</Text>

              <Pressable style={styles.attachmentButton}>
                <Ionicons name="attach" size={16} color="#6B7280" />
                <Text style={styles.attachmentText}>Attachment</Text>
              </Pressable>

              <AppraisalAccordion
                title="Appraise Comments (Crew)"
                expanded={expanded.annualCrew}
                onToggle={() => toggle('annualCrew')}
                onEdit={() =>
                  Alert.alert('Edit', 'You can type your comments below.')
                }
              >
                <TextInput
                  style={styles.annualInput}
                  placeholder="Type something here"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={annualCrewComment}
                  onChangeText={setAnnualCrewComment}
                />
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Appraise Comments"
                expanded={expanded.annualAppraiser}
                onToggle={() => toggle('annualAppraiser')}
              >
                <Text style={styles.naText}>N/A</Text>
              </AppraisalAccordion>

              <AppraisalAccordion
                title="Final Rating"
                expanded={expanded.annualRating}
                onToggle={() => toggle('annualRating')}
              >
                <Text style={styles.naText}>N/A</Text>
              </AppraisalAccordion>
            </>
          )}
        </View>
      </SmoothScrollView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.3"
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  tabInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  tabText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  tabTextInactive: {
    color: '#4B5563',
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
  objectiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005C70',
  },
  objectiveNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  prevButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  prevButtonPressed: {
    backgroundColor: '#F0FDF4',
  },
  prevButtonText: {
    color: '#5B8C3E',
    fontWeight: '700',
    fontSize: 16,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonPressed: {
    backgroundColor: '#4A7332',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C70',
    marginBottom: 12,
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
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  attachmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  annualInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  naText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
