import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const accounts = [
  {
    id: '1',
    name: 'XTB',
  },
  {
    id: '2',
    name: 'Interactive Brokers',
  },
];

export default function SelectAccountScreen() {
  function handleSelectAccount(accountId: string) {
    router.push({
      pathname: '/import/asset',
      params: { accountId },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select account</Text>

      {accounts.map((account) => (
        <Pressable
          key={account.id}
          style={styles.account}
          onPress={() => handleSelectAccount(account.id)}
        >
          <Text style={styles.accountName}>{account.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  account: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '600',
  },
});
