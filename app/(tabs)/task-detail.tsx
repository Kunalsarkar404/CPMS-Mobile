import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '@/components/AppHeader';
import ErrorState from '@/components/ErrorState';
import Sidebar from '@/components/Sidebar';
import SmoothScrollView from '@/components/SmoothScrollView';
import TaskCard from '@/components/TaskCard';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { getTaskById } from '@/constants/tasks';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [response, setResponse] = useState('');

  const task = getTaskById(id ?? '');

  if (!task) {
    return (
      <View style={styles.container}>
        <AppHeader
          onMenuPress={() => setSidebarOpen(true)}
          onProfilePress={() => router.push('/(tabs)/profile')}
        />
        <ErrorState
          fullScreen
          title="Task not found"
          message="This task could not be loaded."
          onRetry={() => router.replace('/(tabs)/my-tasks')}
          retryLabel="Go Back"
        />
        <Sidebar
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItemId="1.2"
          onItemPress={handleSidebarItem}
        />
      </View>
    );
  }

  const handleSubmit = () => {
    router.replace('/(tabs)/task-success');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SmoothScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace('/(tabs)/my-tasks')}
            >
              <View style={styles.backIcon}>
                <Ionicons name="chevron-back" size={18} color="#6B7280" />
              </View>
              <Text style={styles.backText}>Go Back</Text>
            </Pressable>

            <Text style={styles.title}>{task.title}</Text>

            <TaskCard task={task} showChevron={false} />

            <Text style={styles.responseHeading}>
              Please Enter your Response
            </Text>

            <Text style={styles.responseLabel}>Response</Text>
            <TextInput
              style={styles.responseInput}
              placeholder="Type your message here"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={response}
              onChangeText={setResponse}
            />

            <Pressable
              style={({ pressed }) => [
                styles.attachmentButton,
                pressed && styles.attachmentButtonPressed,
              ]}
            >
              <Ionicons name="attach" size={18} color="#6B7280" />
              <Text style={styles.attachmentText}>Attachment</Text>
            </Pressable>
          </View>
        </SmoothScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId="1.2"
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
  backIcon: {
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
  responseHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C70',
    marginTop: 8,
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  responseInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 140,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  attachmentButtonPressed: {
    backgroundColor: '#F9FAFB',
  },
  attachmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonPressed: {
    backgroundColor: '#4A7332',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
});
