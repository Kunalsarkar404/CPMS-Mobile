import { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch } from '@/hooks';
import SmoothScrollView from '@/components/SmoothScrollView';
import { setSelectedRole, type UserRole } from '@/store/slices/authSlice';

interface RoleOption {
  id: UserRole;
  label: string;
  sublabel?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ROLES: RoleOption[] = [
  { id: 'cabin_crew', label: 'Cabin', sublabel: 'Crew', icon: 'people' },
  {
    id: 'system_admin',
    label: 'System',
    sublabel: 'Admin',
    icon: 'people',
  },
  {
    id: 'performance_manager',
    label: 'Performance',
    sublabel: 'Manager',
    icon: 'people',
  },
  {
    id: 'super_user',
    label: 'Super',
    sublabel: 'User',
    icon: 'people',
  },
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    dispatch(setSelectedRole(selected));
    router.push('/(auth)/staff-search');
  };

  return (
    <SmoothScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.bannerSection}>
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/airplane.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Access Verified - Select Role</Text>
      </View>

      <View style={styles.roleGrid}>
        {ROLES.map((role) => {
          const isSelected = selected === role.id;
          return (
            <Pressable
              key={role.id}
              style={[
                styles.roleCard,
                isSelected ? styles.roleCardSelected : styles.roleCardDefault,
              ]}
              onPress={() => setSelected(role.id)}
            >
              <Ionicons
                name={role.icon}
                size={32}
                color={isSelected ? '#5B8C3E' : '#0D7377'}
              />
              <Text
                style={[
                  styles.roleLabel,
                  isSelected ? styles.roleTextSelected : styles.roleTextDefault,
                ]}
              >
                {role.label}
              </Text>
              {role.sublabel && (
                <Text
                  style={[
                    styles.roleSublabel,
                    isSelected ? styles.roleTextSelected : styles.roleTextDefault,
                  ]}
                >
                  {role.sublabel}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            selected ? styles.continueButtonEnabled : styles.continueButtonDisabled,
            selected && pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SmoothScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
    marginHorizontal: 0,
  },
  bannerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bannerContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  roleGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  roleCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  roleCardSelected: {
    borderColor: '#5B8C3E',
    backgroundColor: '#F0FDF4',
  },
  roleCardDefault: {
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  roleSublabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  roleTextSelected: {
    color: '#5B8C3E',
  },
  roleTextDefault: {
    color: '#1F2937',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  continueButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#5B8C3E',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(91, 140, 62, 0.5)',
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
