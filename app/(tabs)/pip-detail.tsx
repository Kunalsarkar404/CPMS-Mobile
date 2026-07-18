import { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import ErrorState from '@/components/ErrorState';
import SmoothScrollView from '@/components/SmoothScrollView';
import Sidebar from '@/components/Sidebar';
import AppraisalAccordion from '@/components/AppraisalAccordion';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { getPipById } from '@/constants/pip';

type PipTab = 'details' | 'objectives';

function DetailField({
  label,
  value,
  multiline = false,
  style,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={style}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, multiline && styles.fieldBoxMultiline]}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function PipDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PipTab>('details');
  const [expandedObjectives, setExpandedObjectives] = useState<
    Record<string, boolean>
  >({ 'obj-1': true, 'obj-2': true });
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const pip = useMemo(() => getPipById(id ?? ''), [id]);

  if (!pip) {
    return (
      <View style={styles.screen}>
        <AppHeader
          onMenuPress={() => setSidebarOpen(true)}
          onProfilePress={() => router.push('/(tabs)/profile')}
        />
        <ErrorState
          fullScreen
          title="PIP not found"
          message="This performance improvement plan could not be loaded."
          onRetry={() => router.back()}
          retryLabel="Go Back"
        />
        <Sidebar
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItemId="1.4"
          onItemPress={handleSidebarItem}
        />
      </View>
    );
  }

  const statusLabel = pip.status === 'open' ? 'Open' : 'Closed';

  const toggleObjective = (objectiveId: string) => {
    setExpandedObjectives((prev) => ({
      ...prev,
      [objectiveId]: !prev[objectiveId],
    }));
  };

  const isCardExpanded = (key: string) => expandedCards[key] !== false;

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !(prev[key] !== false),
    }));
  };

  const startEdit = (key: string, current: string) => {
    setEditingKey(key);
    setEditDraft(current);
  };

  const saveEdit = () => {
    setEditingKey(null);
    Alert.alert('Saved', 'Comments updated.');
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

          <Text style={styles.title}>
            {pip.code} - {statusLabel}
          </Text>
          <Text style={styles.subtitle}>
            Next Action Date: {pip.nextActionDate}
          </Text>

          <View style={styles.tabRow}>
            {(
              [
                { id: 'details', label: 'PIP Details' },
                { id: 'objectives', label: 'PIP Objectives' },
              ] as const
            ).map((tab) => {
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
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'details' && (
            <View style={styles.detailsCard}>
              <Text style={styles.detailsHeading}>PIP Details</Text>

              <DetailField
                label="OPS Code"
                value={pip.opsCode}
                style={styles.fieldSpacing}
              />

              <View style={styles.fieldRow}>
                <DetailField
                  label="Type"
                  value={pip.type}
                  style={styles.fieldFlex}
                />
                <DetailField
                  label="Appraisal Year"
                  value={pip.appraisalYear}
                  style={styles.fieldFlex}
                />
              </View>

              <DetailField
                label="Description of the under performance"
                value={pip.underPerformanceDescription}
                multiline
                style={styles.fieldSpacing}
              />

              <View style={styles.fieldRow}>
                <DetailField
                  label="PIP Start Date (First Instance)"
                  value={pip.startDateFirst}
                  style={styles.fieldFlex}
                />
                <DetailField
                  label="PIP Start Date (Second Instance)"
                  value={pip.startDateSecond}
                  style={styles.fieldFlex}
                />
              </View>

              <DetailField
                label="Aim of the performance improvement plan"
                value={pip.aim}
                multiline
                style={styles.fieldSpacing}
              />

              <DetailField
                label="Status"
                value={statusLabel}
                style={styles.fieldSpacing}
              />
              <DetailField label="PIP Owner" value={pip.owner} />
            </View>
          )}

          {activeTab === 'objectives' && (
            <>
              <Pressable style={styles.attachmentButton}>
                <Ionicons name="attach" size={16} color="#6B7280" />
                <Text style={styles.attachmentText}>Attachment</Text>
              </Pressable>

              {pip.objectives.map((objective) => {
                const isOpen = expandedObjectives[objective.id] !== false;
                const crewKey = `${objective.id}-crew`;
                const isEditing = editingKey === crewKey;

                return (
                  <View key={objective.id} style={styles.objectiveBlock}>
                    <Pressable
                      style={styles.objectiveHeader}
                      onPress={() => toggleObjective(objective.id)}
                    >
                      <Text style={styles.objectiveTitle}>
                        {objective.title}
                      </Text>
                      <Ionicons
                        name={isOpen ? 'chevron-down' : 'chevron-forward'}
                        size={18}
                        color="#2C5271"
                      />
                    </Pressable>

                    {isOpen && (
                      <>
                        <AppraisalAccordion
                          title="Improvement Objectives"
                          expanded={isCardExpanded(`${objective.id}-imp`)}
                          onToggle={() => toggleCard(`${objective.id}-imp`)}
                        >
                          <Text style={styles.bodyText}>
                            {objective.improvementObjectives}
                          </Text>
                        </AppraisalAccordion>

                        <AppraisalAccordion
                          title="Success Criteria"
                          expanded={isCardExpanded(`${objective.id}-success`)}
                          onToggle={() =>
                            toggleCard(`${objective.id}-success`)
                          }
                        >
                          <Text style={styles.bodyText}>
                            {objective.successCriteria}
                          </Text>
                        </AppraisalAccordion>

                        <AppraisalAccordion
                          title={
                            objective.id === 'obj-2'
                              ? 'Appraise Comments (Crew)'
                              : 'Crew Comments'
                          }
                          expanded={isCardExpanded(crewKey)}
                          onToggle={() => toggleCard(crewKey)}
                          onEdit={
                            isEditing
                              ? undefined
                              : () =>
                                  startEdit(crewKey, objective.crewComments)
                          }
                        >
                          {isEditing ? (
                            <View>
                              <TextInput
                                style={styles.editInput}
                                multiline
                                textAlignVertical="top"
                                value={editDraft}
                                onChangeText={setEditDraft}
                              />
                              <View style={styles.editActions}>
                                <Pressable
                                  style={styles.cancelButton}
                                  onPress={() => setEditingKey(null)}
                                >
                                  <Text style={styles.cancelButtonText}>
                                    Cancel
                                  </Text>
                                </Pressable>
                                <Pressable
                                  style={styles.saveButton}
                                  onPress={saveEdit}
                                >
                                  <Text style={styles.saveButtonText}>
                                    Save
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                          ) : (
                            <Text style={styles.bodyText}>
                              {objective.crewComments}
                            </Text>
                          )}
                        </AppraisalAccordion>

                        <AppraisalAccordion
                          title={
                            objective.id === 'obj-2'
                              ? 'Appraise Comments'
                              : 'Appraiser Comments'
                          }
                          expanded={isCardExpanded(
                            `${objective.id}-appraiser`
                          )}
                          onToggle={() =>
                            toggleCard(`${objective.id}-appraiser`)
                          }
                        >
                          <Text style={styles.bodyText}>
                            {objective.appraiserComments}
                          </Text>
                        </AppraisalAccordion>
                      </>
                    )}
                  </View>
                );
              })}
            </>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  tabTextInactive: {
    color: '#4B5563',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  detailsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C70',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  fieldBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldBoxMultiline: {
    minHeight: 90,
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
  },
  fieldSpacing: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fieldFlex: {
    flex: 1,
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
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  attachmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  objectiveBlock: {
    marginBottom: 16,
  },
  objectiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C5271',
  },
  bodyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    backgroundColor: '#fff',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 10,
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
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
