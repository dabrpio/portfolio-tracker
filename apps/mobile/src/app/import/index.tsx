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

import { AccountItem } from '@/features/accounts/components/account-item';
import { useAccounts } from '@/features/accounts/hooks/use-accounts';

export default function SelectAccountScreen() {
  const { data: accounts, isLoading } = useAccounts();

  function handleSelectAccount(accountId: string) {
    router.push({
      pathname: '/import/asset',
      params: { accountId },
    });
  }

  function handleCreateAccount() {
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
          keyExtractor={(account) => account.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Select account</Text>
              <Text style={styles.subtitle}>
                Choose which account to import transaction into
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <AccountItem
              account={item}
              onPress={() => handleSelectAccount(item.id)}
            />
          )}
          ListFooterComponent={
            <Pressable
              style={({ pressed }) => [
                styles.addNewButton,
                pressed && styles.addNewButtonPressed,
              ]}
              onPress={handleCreateAccount}
            >
              <View style={styles.plusIconWrapper}>
                <MaterialCommunityIcons name="plus" size={20} color="#111" />
              </View>
              <Text style={styles.addNewButtonText}>Add new account</Text>
            </Pressable>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No accounts found</Text>
            </View>
          }
        />
      )}
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
    gap: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#fff',
    marginTop: 8,
    gap: 12,
  },
  addNewButtonPressed: {
    backgroundColor: '#f1f5f9',
  },
  plusIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
