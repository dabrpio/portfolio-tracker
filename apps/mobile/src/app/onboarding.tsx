import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountForm } from '@/features/accounts/components/account-form';
import { useAccounts } from '@/features/accounts/hooks/use-accounts';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { data: accounts, isLoading } = useAccounts();

  useEffect(() => {
    if (!isLoading && accounts && accounts.length > 0) {
      router.replace('/(tabs)/net-worth');
    }
  }, [accounts, isLoading]);

  function handleSuccess() {
    router.replace('/(tabs)/net-worth');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.badge}>Step 1 of 1</Text>
          <Text style={styles.title}>Create your first account</Text>
          <Text style={styles.subtitle}>
            An account is needed to track your assets and record transactions.
            You can add more accounts later anytime.
          </Text>
        </View>

        <View style={styles.card}>
          <AccountForm
            submitButtonText="Create & Get Started"
            onSuccess={handleSuccess}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
