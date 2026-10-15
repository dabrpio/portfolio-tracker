import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Operation, StockOperation } from '@portfolio-tracker/shared';

interface OperationItem {
  id: StockOperation;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const STOCK_OPERATIONS: OperationItem[] = [
  {
    id: 'BUY',
    title: 'Buy',
    description: 'Purchase shares of the asset',
    icon: 'plus-circle-outline',
    color: '#16a34a',
  },
  {
    id: 'SELL',
    title: 'Sell',
    description: 'Sell shares of the asset',
    icon: 'minus-circle-outline',
    color: '#dc2626',
  },
  {
    id: 'DIVIDEND',
    title: 'Dividend',
    description: 'Cash payout received from shares',
    icon: 'cash-multiple',
    color: '#2563eb',
  },
  {
    id: 'REWARD',
    title: 'Reward',
    description: 'Bonus, referral or staking shares',
    icon: 'gift-outline',
    color: '#d97706',
  },
];

interface OperationPickerModalProps {
  visible: boolean;
  selectedOperation: Operation;
  onSelect: (operation: StockOperation) => void;
  onClose: () => void;
}

export function OperationPickerModal({
  visible,
  selectedOperation,
  onSelect,
  onClose,
}: OperationPickerModalProps) {
  function handleSelect(op: StockOperation) {
    onSelect(op);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Select operation</Text>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={22} color="#475569" />
              </Pressable>
            </View>

            <View style={styles.list}>
              {STOCK_OPERATIONS.map((item) => {
                const isSelected = selectedOperation === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.itemRow,
                      isSelected && styles.itemRowSelected,
                      pressed && styles.itemRowPressed,
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${item.color}15` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={22}
                        color={item.color}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDescription}>
                        {item.description}
                      </Text>
                    </View>

                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color="#0f172a"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    gap: 8,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  itemRowSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#f1f5f9',
  },
  itemRowPressed: {
    opacity: 0.85,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
});
