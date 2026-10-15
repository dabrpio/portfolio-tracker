import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useImportTransaction } from '@/features/transactions/context/import-context';
import type { CashOperation, StockOperation } from '@portfolio-tracker/shared';

interface OperationOption<T extends string> {
  id: T;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const CASH_OPTIONS: OperationOption<CashOperation>[] = [
  {
    id: 'DEPOSIT',
    title: 'Deposit funds',
    subtitle: 'Add cash into your brokerage balance',
    icon: 'arrow-down-circle',
    color: '#16a34a',
  },
  {
    id: 'WITHDRAWAL',
    title: 'Withdraw funds',
    subtitle: 'Transfer cash out of your account',
    icon: 'arrow-up-circle',
    color: '#dc2626',
  },
];

const STOCK_OPTIONS: OperationOption<StockOperation>[] = [
  {
    id: 'BUY',
    title: 'Buy',
    subtitle: 'Purchase shares of stocks or ETFs',
    icon: 'plus-circle-outline',
    color: '#16a34a',
  },
  {
    id: 'SELL',
    title: 'Sell',
    subtitle: 'Sell shares from your portfolio',
    icon: 'minus-circle-outline',
    color: '#dc2626',
  },
  {
    id: 'DIVIDEND',
    title: 'Dividend',
    subtitle: 'Cash payout from shares held',
    icon: 'cash-multiple',
    color: '#2563eb',
  },
  {
    id: 'REWARD',
    title: 'Reward',
    subtitle: 'Bonus shares, cashback, or referral',
    icon: 'gift-outline',
    color: '#d97706',
  },
];

export default function SelectOperationScreen() {
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const { setSelectedOperation } = useImportTransaction();

  function handleSelectCash(operation: CashOperation) {
    setSelectedOperation(operation);
    router.push({
      pathname: '/import/cash-details',
      params: { accountId, operation },
    });
  }

  function handleSelectStock(operation: StockOperation) {
    setSelectedOperation(operation);
    router.push({
      pathname: '/import/asset',
      params: { accountId, operation },
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Select operation</Text>
        <Text style={styles.subtitle}>
          Choose the transaction type for this brokerage account
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>CASH OPERATIONS</Text>
        <View style={styles.cardGroup}>
          {CASH_OPTIONS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => handleSelectCash(item.id)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={item.color}
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#94a3b8"
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>TRADE & INCOME</Text>
        <View style={styles.cardGroup}>
          {STOCK_OPTIONS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => handleSelectStock(item.id)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={item.color}
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#94a3b8"
              />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
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
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  cardGroup: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardPressed: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
});
