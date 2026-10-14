import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CURRENCIES,
  getFlagUrl,
  type Currency,
} from '@portfolio-tracker/shared';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CurrencyPickerModalProps {
  visible: boolean;
  selectedCurrency: string;
  onSelect: (currencyCode: string) => void;
  onClose: () => void;
}

export function CurrencyPickerModal({
  visible,
  selectedCurrency,
  onSelect,
  onClose,
}: CurrencyPickerModalProps) {
  const [search, setSearch] = useState('');

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSelect(currency: Currency) {
    onSelect(currency.code);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Currency</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search currency code or name..."
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={filteredCurrencies}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
          initialNumToRender={20}
          renderItem={({ item }) => {
            const isSelected = selectedCurrency === item.code;

            return (
              <Pressable
                style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.flagContainer}>
                  <Image
                    source={{ uri: getFlagUrl(item.countryCode, 'w80') }}
                    style={styles.flagImage}
                    contentFit="cover"
                    transition={200}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={styles.codeText}>{item.code}</Text>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#111"
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemRowSelected: {
    backgroundColor: '#f3f4f6',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  flagImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  info: {
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  nameText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
});
