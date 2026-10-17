import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { getAuthErrorMessage } from '@/features/auth/auth-error';
import { register } from '@/features/auth/auth.service';
import { AuthTextInput } from '@/features/auth/components/auth-text-input';

const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      setServerError(null);

      try {
        await register(data.email, data.password);
      } catch (error) {
        setServerError(
          getAuthErrorMessage(
            error,
            'Could not create your account. Please try again.',
          ),
        );
      }
    });
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 24,
              paddingBottom: Math.max(insets.bottom, 24) + 16,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header & Branding */}
          <View style={styles.header}>
            <View style={styles.brandIconContainer}>
              <MaterialCommunityIcons
                name="chart-line"
                size={30}
                color="#ffffff"
              />
            </View>

            <Text style={styles.badge}>GET STARTED</Text>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>
              Track your investments, calculate performance, and monitor net
              worth seamlessly.
            </Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            {serverError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color="#dc2626"
                  style={styles.errorBannerIcon}
                />
                <Text style={styles.errorBannerText}>{serverError}</Text>
              </View>
            ) : null}

            <View style={styles.fieldsContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <AuthTextInput
                    ref={ref}
                    label="Email"
                    iconName="email-outline"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    value={value}
                    onChangeText={(val) => {
                      onChange(val);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    onSubmitEditing={() => setFocus('password')}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <AuthTextInput
                    ref={ref}
                    label="Password"
                    iconName="lock-outline"
                    placeholder="At least 6 characters"
                    isPassword
                    autoComplete="new-password"
                    returnKeyType="next"
                    hint={errors.password ? undefined : 'Minimum 6 characters'}
                    value={value}
                    onChangeText={(val) => {
                      onChange(val);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    onSubmitEditing={() => setFocus('confirmPassword')}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <AuthTextInput
                    ref={ref}
                    label="Confirm Password"
                    iconName="lock-check-outline"
                    placeholder="Re-enter your password"
                    isPassword
                    autoComplete="new-password"
                    returnKeyType="done"
                    value={value}
                    onChangeText={(val) => {
                      onChange(val);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isPending && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={styles.submitButtonContent}>
                  <Text style={styles.submitButtonText}>Create Account</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={18}
                    color="#ffffff"
                  />
                </View>
              )}
            </Pressable>
          </View>

          {/* Switch to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable
                hitSlop={8}
                style={({ pressed }) => [
                  styles.footerLinkPressable,
                  pressed && styles.footerLinkPressed,
                ]}
              >
                <Text style={styles.footerLink}>Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  errorBannerIcon: {
    marginRight: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#b91c1c',
    lineHeight: 18,
  },
  fieldsContainer: {
    gap: 16,
    marginBottom: 22,
  },
  submitButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerLinkPressable: {
    paddingVertical: 4,
  },
  footerLinkPressed: {
    opacity: 0.7,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
});
