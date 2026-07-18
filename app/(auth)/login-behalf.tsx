import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { saveAuthSession } from '@/services/auth/session';
import { completeSignIn } from '@/store/slices/authSlice';

export default function LoginBehalfScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, selectedRole, selectedStaff } = useAppSelector(
    (state) => state.auth
  );

  const handleContinue = async () => {
    if (!user || !token || !selectedRole || !selectedStaff) return;

    await saveAuthSession({
      user,
      token,
      selectedRole,
      selectedStaff,
    });
    dispatch(completeSignIn());
    router.replace('/(tabs)');
  };

  if (!user || !token || !selectedRole || !selectedStaff) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sign-in details are incomplete</Text>
        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.heading}>
          You are Logging in on behalf of
        </Text>

        <View style={styles.staffCard}>
          <Text style={styles.staffName}>{selectedStaff.name}</Text>
          <View style={styles.staffDetailsRow}>
            <View style={styles.staffDetailColumn}>
              <Text style={styles.staffDetailLabel}>Staff ID:</Text>
              <Text style={styles.staffDetailValue}>{selectedStaff.id}</Text>
            </View>
            <View style={styles.staffDetailColumn}>
              <Text style={styles.staffDetailLabel}>Nationality:</Text>
              <Text style={styles.staffDetailValue}>
                {selectedStaff.nationality}
              </Text>
            </View>
            <View style={styles.staffDetailColumn}>
              <Text style={styles.staffDetailLabel}>Grade:</Text>
              <Text style={styles.staffDetailValue}>{selectedStaff.grade}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 16,
  },
  goBackButton: {
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
  },
  staffCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  staffDetailsRow: {
    flexDirection: 'row',
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
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonPressed: {
    backgroundColor: '#4A7332',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
