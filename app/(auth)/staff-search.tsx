import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch } from '@/hooks';
import { setSelectedStaff } from '@/store/slices/authSlice';
import { MOCK_STAFF, type StaffMember } from '@/constants/staff';

function StaffDetails({ staff }: { staff: StaffMember }) {
  return (
    <View style={styles.staffDetailsRow}>
      <View style={styles.staffDetailColumn}>
        <Text style={styles.staffDetailLabel}>Staff ID:</Text>
        <Text style={styles.staffDetailValue}>{staff.id}</Text>
      </View>
      <View style={styles.staffDetailColumn}>
        <Text style={styles.staffDetailLabel}>Nationality:</Text>
        <Text style={styles.staffDetailValue}>{staff.nationality}</Text>
      </View>
      <View style={styles.staffDetailColumn}>
        <Text style={styles.staffDetailLabel}>Grade:</Text>
        <Text style={styles.staffDetailValue}>{staff.grade}</Text>
      </View>
    </View>
  );
}

export default function StaffSearchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');

  const filteredStaff = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_STAFF;
    return MOCK_STAFF.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelectStaff = (staff: StaffMember) => {
    dispatch(setSelectedStaff(staff));
    router.push('/(auth)/login-behalf');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.titleSection}>
        <Text style={styles.title}>Log In as:</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by staff ID or name"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.listSection}>
        <View style={styles.listContainer}>
          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.listItem,
                  pressed && styles.listItemPressed,
                ]}
                onPress={() => handleSelectStaff(item)}
              >
                <Text style={styles.staffName}>{item.name}</Text>
                <StaffDetails staff={item} />
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No staff found</Text>
              </View>
            }
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
  },
  divider: {
    height: 3,
    backgroundColor: '#2563EB',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  staffDetailsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  staffDetailColumn: {
    flex: 1,
  },
  staffDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  staffDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
