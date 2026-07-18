import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch } from '@/hooks';
import SmoothScrollView from '@/components/SmoothScrollView';
import { setUser } from '@/store/slices/authSlice';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    dispatch(
      setUser({
        user: {
          id: '1',
          email: email || 'user@example.com',
          name: 'Admin User',
        },
        token: 'mock-token',
      })
    );
    router.push('/(auth)/role-select');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SmoothScrollView style={styles.scrollView} bounces={false}>
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
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        <View style={styles.formSection}>
          <View>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@gmail.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <View style={styles.passwordHeader}>
              <Text style={styles.labelNoMargin}>Password</Text>
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
      </SmoothScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 20,
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  labelNoMargin: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#5B8C3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonPressed: {
    backgroundColor: '#4A7332',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
