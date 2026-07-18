import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import Avatar from '@/components/Avatar';
import ConfirmModal from '@/components/ConfirmModal';
import Sidebar from '@/components/Sidebar';
import SmoothScrollView from '@/components/SmoothScrollView';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import {
  cancelAllTrackedNotifications,
  resetNotificationInitialization,
} from '@/services/notifications';
import { clearAuthSession } from '@/services/auth/session';
import { logout } from '@/store/slices/authSlice';

interface ProfileFieldProps {
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
}

function ProfileField({ label, value, style }: ProfileFieldProps) {
  return (
    <View style={style}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInput}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

interface ManagerCardProps {
  name: string;
  designation: string;
  contact: string;
}

function ManagerCard({ name, designation, contact }: ManagerCardProps) {
  return (
    <View style={styles.managerCard}>
      <View style={styles.managerHeader}>
        <Avatar name={name} size="sm" backgroundColor="#1A5276" />
        <Text style={styles.managerName}>{name}</Text>
      </View>
      <View style={styles.managerRow}>
        <Text style={styles.managerLabel}>Designation:</Text>
        <Text style={styles.managerValue}>{designation}</Text>
      </View>
      <View style={styles.managerRow}>
        <Text style={styles.managerLabel}>Contact:</Text>
        <Text style={styles.managerValue}>{contact}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedStaff } = useAppSelector((state) => state.auth);
  const { handleSidebarItem } = useSidebarNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const profile = {
    name: selectedStaff?.name ?? 'Rohan Gupta',
    staffId: selectedStaff?.id ?? 'CP1234',
    grade: selectedStaff?.grade ?? 'CS',
    nationality: selectedStaff?.nationality ?? 'Indian',
    dateOfJoining: '05-09-2023',
  };

  const handleLogout = () => {
    setLogoutVisible(false);
    void (async () => {
      await cancelAllTrackedNotifications();
      await clearAuthSession();
      resetNotificationInitialization();
      dispatch(logout());
      router.replace('/(auth)/login');
    })();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        onMenuPress={() => setSidebarOpen(true)}
        onProfilePress={() => {}}
      />

      <SmoothScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Your Profile</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Profile Details</Text>

          <View style={styles.avatarContainer}>
            <Avatar name={profile.name} size="xl" />
          </View>

          <ProfileField label="Name" value={profile.name} style={styles.fieldSpacing} />

          <View style={styles.rowFields}>
            <ProfileField
              label="Staff ID"
              value={profile.staffId}
              style={styles.flexField}
            />
            <ProfileField
              label="Grade"
              value={profile.grade}
              style={styles.flexField}
            />
          </View>

          <ProfileField
            label="Nationality"
            value={profile.nationality}
            style={styles.fieldSpacing}
          />
          <ProfileField
            label="Date of Joining"
            value={profile.dateOfJoining}
          />
        </View>

        <View style={styles.managersSection}>
          <Text style={styles.sectionTitle}>
            Your Managers at Salam Air
          </Text>

          <ManagerCard
            name="Akif Hussain"
            designation="Chief Officer"
            contact="123-46-789"
          />
          <ManagerCard
            name="Michael Smith"
            designation="Training Manager"
            contact="123-46-789"
          />
        </View>

        <View style={styles.logoutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={() => setLogoutVisible(true)}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </SmoothScrollView>

      <ConfirmModal
        visible={logoutVisible}
        title="Log out of CPMS?"
        message="You will need to sign in again to access your account."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleLogout}
        onCancel={() => setLogoutVisible(false)}
      />

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItemId=""
        onItemPress={handleSidebarItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  detailsSection: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A5276',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
  },
  fieldSpacing: {
    marginBottom: 16,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  flexField: {
    flex: 1,
  },
  managerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  managerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  managerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  managerLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 96,
  },
  managerValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  managersSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoutButtonPressed: {
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
