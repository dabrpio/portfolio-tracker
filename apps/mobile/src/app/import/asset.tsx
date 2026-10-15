import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useImportTransaction,
  type AssetInfo,
} from '@/features/transactions/context/import-context';

interface MockAsset extends AssetInfo {
  type: 'Stock' | 'ETF';
}

const MOCK_ASSETS: MockAsset[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    domain: 'apple.com',
    type: 'Stock',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    domain: 'microsoft.com',
    type: 'Stock',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    domain: 'nvidia.com',
    type: 'Stock',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    domain: 'amazon.com',
    type: 'Stock',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc. (Google)',
    domain: 'abc.xyz',
    type: 'Stock',
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    domain: 'meta.com',
    type: 'Stock',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    domain: 'tesla.com',
    type: 'Stock',
  },
  {
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    domain: 'netflix.com',
    type: 'Stock',
  },
  {
    ticker: 'DIS',
    name: 'The Walt Disney Company',
    domain: 'thewaltdisneycompany.com',
    type: 'Stock',
  },
  {
    ticker: 'INTC',
    name: 'Intel Corporation',
    domain: 'intel.com',
    type: 'Stock',
  },
  {
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    domain: 'ssga.com',
    type: 'ETF',
  },
  {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    domain: 'invesco.com',
    type: 'ETF',
  },
];

export default function SelectAssetScreen() {
  const { accountId, operation, returnTo } = useLocalSearchParams<{
    accountId?: string;
    operation?: string;
    returnTo?: string;
  }>();

  const [query, setQuery] = useState('');
  const { setSelectedAsset } = useImportTransaction();

  const filteredAssets = MOCK_ASSETS.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.ticker.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q)
    );
  });

  function handleSelectAsset(item: MockAsset) {
    setSelectedAsset(item);

    if (returnTo) {
      router.back();
      return;
    }

    router.push({
      pathname: '/import/details',
      params: {
        accountId,
        ticker: item.ticker,
        operation,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#64748b"
          style={styles.searchIcon}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search stocks and ETFs..."
          placeholderTextColor="#94a3b8"
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.ticker}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const logoUrl = item.domain
            ? `https://img.logo.dev/${item.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
            : null;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.assetRow,
                pressed && styles.assetRowPressed,
              ]}
              onPress={() => handleSelectAsset(item)}
            >
              <View style={styles.logoWrapper}>
                {logoUrl ? (
                  <Image
                    source={{ uri: logoUrl }}
                    style={styles.logo}
                    contentFit="contain"
                    transition={200}
                  />
                ) : (
                  <Text style={styles.fallbackInitial}>
                    {item.ticker.slice(0, 2)}
                  </Text>
                )}
              </View>

              <View style={styles.infoWrapper}>
                <View style={styles.tickerRow}>
                  <Text style={styles.ticker}>{item.ticker}</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.type}</Text>
                  </View>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#cbd5e1"
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="database-search-outline"
              size={48}
              color="#cbd5e1"
            />
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching for a different company name or ticker
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    paddingBottom: 40,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  assetRowPressed: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logo: {
    width: 28,
    height: 28,
  },
  fallbackInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  infoWrapper: {
    flex: 1,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticker: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  name: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
