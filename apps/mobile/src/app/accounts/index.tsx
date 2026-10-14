import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountItem } from '@/features/accounts/components/account-item';
import { useAccounts } from '@/features/accounts/hooks/use-accounts';

export default function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const { data: accounts, isLoading, refetch } = useAccounts();

  function handleAddAccount() {
    router.push('/accounts/create');
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <FlatList
          data={accounts ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 90 },
          ]}
          onRefresh={refetch}
          refreshing={isLoading}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Your Accounts</Text>
              <Text style={styles.subtitle}>
                Manage your brokerage and cash accounts
              </Text>
            </View>
          }
          renderItem={({ item }) => <AccountItem account={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="bank-outline"
                size={48}
                color="#94a3b8"
              />
              <Text style={styles.emptyTitle}>No accounts found</Text>
              <Text style={styles.emptySubtitle}>
                Add your first account to get started
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Account Button */}
      <View style={[styles.bottomBar, { bottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleAddAccount}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  addButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
