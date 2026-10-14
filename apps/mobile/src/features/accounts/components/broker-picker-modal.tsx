import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BROKERS, type Broker } from '@portfolio-tracker/shared';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BrokerPickerModalProps {
  visible: boolean;
  selectedBroker: string | null;
  onSelect: (brokerName: string) => void;
  onClose: () => void;
}

export function BrokerPickerModal({
  visible,
  selectedBroker,
  onSelect,
  onClose,
}: BrokerPickerModalProps) {
  const [search, setSearch] = useState('');
  const [customBroker, setCustomBroker] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const filteredBrokers = BROKERS.filter((broker) =>
    broker.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSelectPredefined(broker: Broker) {
    onSelect(broker.name);
    onClose();
  }

  function handleSelectCustom() {
    if (customBroker.trim().length > 0) {
      onSelect(customBroker.trim());
      setIsCustomMode(false);
      setCustomBroker('');
      onClose();
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Broker</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </Pressable>
        </View>

        {!isCustomMode ? (
          <>
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#888"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search broker..."
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredBrokers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = selectedBroker === item.name;
                const logoUrl = `https://img.logo.dev/${item.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`;

                return (
                  <Pressable
                    style={[
                      styles.itemRow,
                      isSelected && styles.itemRowSelected,
                    ]}
                    onPress={() => handleSelectPredefined(item)}
                  >
                    <View style={styles.logoWrapper}>
                      <Image
                        source={{ uri: logoUrl }}
                        style={styles.logo}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.itemText}>{item.name}</Text>
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
              ListFooterComponent={
                <Pressable
                  style={styles.customRow}
                  onPress={() => setIsCustomMode(true)}
                >
                  <View style={styles.customIconWrapper}>
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={24}
                      color="#555"
                    />
                  </View>
                  <View>
                    <Text style={styles.customTitle}>
                      Other / Unlisted Broker
                    </Text>
                    <Text style={styles.customSubtitle}>
                      Type your own broker name
                    </Text>
                  </View>
                </Pressable>
              }
            />
          </>
        ) : (
          <View style={styles.customInputContainer}>
            <Text style={styles.inputLabel}>Enter broker name</Text>
            <TextInput
              style={styles.customInput}
              placeholder="e.g. Trade Republic, Merrill Edge..."
              value={customBroker}
              onChangeText={setCustomBroker}
              autoFocus
            />

            <View style={styles.customActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setIsCustomMode(false)}
              >
                <Text style={styles.secondaryButtonText}>Back to list</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryButton,
                  customBroker.trim().length === 0 && styles.buttonDisabled,
                ]}
                disabled={customBroker.trim().length === 0}
                onPress={handleSelectCustom}
              >
                <Text style={styles.primaryButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        )}
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
    marginBottom: 6,
  },
  itemRowSelected: {
    backgroundColor: '#f3f4f6',
  },
  logoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logo: {
    width: 24,
    height: 24,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  customIconWrapper: {
    width: 36,
    alignItems: 'center',
    marginRight: 12,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  customSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  customInputContainer: {
    padding: 24,
    gap: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  customActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
