import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CurrencyPickerModal } from '@/features/accounts/components/currency-picker-modal';

interface PriceCurrencyInputProps {
  label: string;
  value: number | undefined;
  onChangeValue: (val: number | undefined) => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
  placeholder?: string;
  error?: string;
}

export function PriceCurrencyInput({
  label,
  value,
  onChangeValue,
  currency,
  onChangeCurrency,
  placeholder = '0.00',
  error,
}: PriceCurrencyInputProps) {
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={value === undefined ? '' : String(value)}
          onChangeText={(text) => {
            const sanitized = text.replace(',', '.');
            if (sanitized === '') {
              onChangeValue(undefined);
            } else {
              const num = Number(sanitized);
              if (!isNaN(num)) {
                onChangeValue(num);
              }
            }
          }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
        />

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.currencyPill,
            pressed && styles.currencyPillPressed,
          ]}
          onPress={() => setCurrencyModalVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        >
          <Text style={styles.currencyText}>{currency || 'USD'}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={18}
            color="#64748b"
          />
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <CurrencyPickerModal
        visible={currencyModalVisible}
        selectedCurrency={currency}
        onSelect={onChangeCurrency}
        onClose={() => setCurrencyModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  currencyPillPressed: {
    backgroundColor: '#f1f5f9',
  },
  currencyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
  },
});
