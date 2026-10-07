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

export default function SelectAssetScreen() {
  const { accountId } = useLocalSearchParams<{
    accountId: string;
  }>();

  const [query, setQuery] = useState('');

  function handleSelectAsset(ticker: string) {
    router.push({
      pathname: '/import/details',
      params: {
        accountId,
        ticker,
      },
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search stocks and ETFs"
        style={styles.input}
        autoCapitalize="characters"
      />

      <FlatList
        data={[
          { name: 'Apple Inc.', ticker: 'AAPL' },
          { name: 'Microsoft Corporation', ticker: 'MSFT' },
          { name: 'Amazon.com, Inc.', ticker: 'AMZN' },
          { name: 'Alphabet Inc.', ticker: 'GOOGL' },
          { name: 'Facebook, Inc.', ticker: 'FB' },
          { name: 'Tesla, Inc.', ticker: 'TSLA' },
          { name: 'NVIDIA Corporation', ticker: 'NVDA' },
          { name: 'Netflix, Inc.', ticker: 'NFLX' },
          { name: 'The Walt Disney Company', ticker: 'DIS' },
          { name: 'Intel Corporation', ticker: 'INTC' },
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={styles.asset}
            onPress={() => handleSelectAsset(item.ticker)}
          >
            <Text>{item.ticker}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.ticker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  asset: {
    paddingVertical: 16,
  },
});
