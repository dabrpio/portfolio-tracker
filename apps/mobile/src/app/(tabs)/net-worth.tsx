import { AddTransactionFab } from '@/components/add-transaction-fab';
import { TabHeader } from '@/components/tab-header';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function NetWorth() {
  return (
    <View style={styles.screen}>
      <TabHeader title="Net worth" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      />
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
  },
  containerContent: {
    padding: 16,
    paddingBottom: 96,
  },
});
