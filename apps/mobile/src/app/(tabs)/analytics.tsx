import { StyleSheet, Text, View } from 'react-native';

import { AddTransactionFab } from '@/components/add-transaction-fab';
import { TabHeader } from '@/components/tab-header';

export default function Analytics() {
  return (
    <View style={styles.screen}>
      <TabHeader title="Analytics" />
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Analytics</Text>
      </View>
      <AddTransactionFab />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748b',
  },
});
