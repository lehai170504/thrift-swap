import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';

// Match Web Colors
const COLORS = {
  background: '#0a0a0f', // Midnight Indigo
  primary: '#8b5cf6', // Electric Purple
  primaryDark: '#7c3aed',
  surface: '#1f1f2e', // Glass surface
  text: '#ffffff',
  textMuted: '#9ca3af',
  border: '#2e2e3f',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);

    // Simulate API call for now to demonstrate UI
    setTimeout(async () => {
      await login({ id: 1, username: email.split('@')[0], email, role: 'USER' }, 'mock-jwt-token');
      setIsLoading(false);
      // alert('Đăng nhập thành công!');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Glow effect background simulation */}
        <View style={styles.glow} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Thriftly.</Text>
            <Text style={styles.title}>Đăng nhập để tiếp tục</Text>
            <Text style={styles.subtitle}>Chào mừng bạn quay trở lại hệ thống đấu giá và giao dịch đồ cũ</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail color={COLORS.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email của bạn"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color={COLORS.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                  <ArrowRight color="#fff" size={20} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
