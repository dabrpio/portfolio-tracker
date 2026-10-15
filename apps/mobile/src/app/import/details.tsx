import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAccounts } from '@/features/accounts/hooks/use-accounts';
import { DatePickerField } from '@/features/transactions/components/date-picker-field';
import { OperationPickerModal } from '@/features/transactions/components/operation-picker-modal';
import { PriceCurrencyInput } from '@/features/transactions/components/price-currency-input';
import { useImportTransaction } from '@/features/transactions/context/import-context';
import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction';
import {
  BROKERS,
  createStockTransactionSchema,
  type CreateStockTransaction,
  type StockOperation,
} from '@portfolio-tracker/shared';

export default function TransactionDetailsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    accountId?: string;
    ticker?: string;
    operation?: StockOperation;
  }>();

  const { data: accounts } = useAccounts();
  const {
    selectedAccountId,
    selectedAsset,
    selectedOperation,
    setSelectedAccountId,
    setSelectedAsset,
    setSelectedOperation,
    reset: resetImportContext,
  } = useImportTransaction();

  const createMutation = useCreateTransaction();
  const [operationModalVisible, setOperationModalVisible] = useState(false);

  // Sync initial params with context
  useEffect(() => {
    if (params.accountId && !selectedAccountId) {
      setSelectedAccountId(params.accountId);
    }
  }, [params.accountId, selectedAccountId, setSelectedAccountId]);

  useEffect(() => {
    if (params.ticker && !selectedAsset) {
      setSelectedAsset({
        ticker: params.ticker,
        name: params.ticker,
      });
    }
  }, [params.ticker, selectedAsset, setSelectedAsset]);

  const activeAccountId = selectedAccountId || params.accountId || '';
  const activeAccount = accounts?.find((acc) => acc.id === activeAccountId);
  const activeTicker = selectedAsset?.ticker || params.ticker || '';
  const activeOperation: StockOperation =
    selectedOperation &&
    (['BUY', 'SELL', 'DIVIDEND', 'REWARD'] as const).includes(
      selectedOperation as StockOperation,
    )
      ? (selectedOperation as StockOperation)
      : params.operation || 'BUY';

  const defaultCurrency = activeAccount?.currency || 'USD';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateStockTransaction>({
    resolver: zodResolver(createStockTransactionSchema),
    defaultValues: {
      accountId: activeAccountId,
      ticker: activeTicker,
      operation: activeOperation,
      quantity: undefined as unknown as number,
      price: undefined as unknown as number,
      currency: defaultCurrency,
      transactionDate: new Date().toISOString(),
      transactionTime: undefined,
      tradingCost: undefined,
      taxes: undefined,
      description: '',
    },
  });

  // Sync when context changes after navigating back from account / asset selector
  useEffect(() => {
    if (selectedAccountId) {
      setValue('accountId', selectedAccountId, { shouldValidate: true });
    }
  }, [selectedAccountId, setValue]);

  useEffect(() => {
    if (selectedAsset) {
      setValue('ticker', selectedAsset.ticker, { shouldValidate: true });
    }
  }, [selectedAsset, setValue]);

  useEffect(() => {
    if (selectedOperation) {
      setValue('operation', selectedOperation as StockOperation, {
        shouldValidate: true,
      });
    }
  }, [selectedOperation, setValue]);

  function handleSelectAccountPress() {
    router.push({
      pathname: '/import',
      params: { returnTo: 'details' },
    });
  }

  function handleSelectAssetPress() {
    router.push({
      pathname: '/import/asset',
      params: { returnTo: 'details' },
    });
  }

  function onSubmit(data: CreateStockTransaction) {
    createMutation.mutate(data, {
      onSuccess: () => {
        resetImportContext();
        const parent = navigation.getParent();
        if (parent && parent.canGoBack()) {
          parent.goBack();
        } else {
          router.dismissAll();
          router.back();
        }
      },
      onError: (err) => {
        Alert.alert(
          'Error',
          err instanceof Error ? err.message : 'Failed to save transaction',
        );
      },
    });
  }

  // Broker logo
  const brokerMeta = BROKERS.find((b) => b.name === activeAccount?.broker);
  const brokerLogoUrl = brokerMeta?.domain
    ? `https://img.logo.dev/${brokerMeta.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
    : null;

  // Asset logo
  const assetLogoUrl = selectedAsset?.domain
    ? `https://img.logo.dev/${selectedAsset.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Account Input Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Account</Text>
        <Pressable
          style={({ pressed }) => [
            styles.selectionInput,
            pressed && styles.selectionInputPressed,
            errors.accountId && styles.inputError,
          ]}
          onPress={handleSelectAccountPress}
        >
          <View style={styles.selectionLeft}>
            <View style={styles.iconCircle}>
              {brokerLogoUrl ? (
                <Image
                  source={{ uri: brokerLogoUrl }}
                  style={styles.logoImage}
                  contentFit="contain"
                />
              ) : (
                <MaterialCommunityIcons
                  name="bank-outline"
                  size={20}
                  color="#64748b"
                />
              )}
            </View>
            <View>
              <Text style={styles.selectionMainText}>
                {activeAccount?.name || 'Select account'}
              </Text>
              {activeAccount?.broker && (
                <Text style={styles.selectionSubText}>
                  {activeAccount.broker} • {activeAccount.currency}
                </Text>
              )}
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#94a3b8"
          />
        </Pressable>
        {errors.accountId && (
          <Text style={styles.error}>{errors.accountId.message}</Text>
        )}
      </View>

      {/* Asset Input Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Asset</Text>
        <Pressable
          style={({ pressed }) => [
            styles.selectionInput,
            pressed && styles.selectionInputPressed,
            errors.ticker && styles.inputError,
          ]}
          onPress={handleSelectAssetPress}
        >
          <View style={styles.selectionLeft}>
            <View style={styles.iconCircle}>
              {assetLogoUrl ? (
                <Image
                  source={{ uri: assetLogoUrl }}
                  style={styles.logoImage}
                  contentFit="contain"
                />
              ) : (
                <Text style={styles.tickerBadge}>
                  {(activeTicker || 'AS').slice(0, 2)}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.selectionMainText}>
                {activeTicker || 'Select asset'}
              </Text>
              {selectedAsset?.name && (
                <Text style={styles.selectionSubText} numberOfLines={1}>
                  {selectedAsset.name}
                </Text>
              )}
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#94a3b8"
          />
        </Pressable>
        {errors.ticker && (
          <Text style={styles.error}>{errors.ticker.message}</Text>
        )}
      </View>

      {/* Operation Picker Field */}
      <Controller
        control={control}
        name="operation"
        render={({ field: { value: opVal, onChange: onOpChange } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Operation</Text>
            <Pressable
              style={({ pressed }) => [
                styles.selectionInput,
                pressed && styles.selectionInputPressed,
                errors.operation && styles.inputError,
              ]}
              onPress={() => setOperationModalVisible(true)}
            >
              <View style={styles.operationSelectedRow}>
                <View
                  style={[
                    styles.operationPill,
                    opVal === 'BUY' && styles.opBuy,
                    opVal === 'SELL' && styles.opSell,
                    opVal === 'DIVIDEND' && styles.opDividend,
                    opVal === 'REWARD' && styles.opReward,
                  ]}
                >
                  <Text
                    style={[
                      styles.operationPillText,
                      opVal === 'BUY' && styles.opBuyText,
                      opVal === 'SELL' && styles.opSellText,
                      opVal === 'DIVIDEND' && styles.opDividendText,
                      opVal === 'REWARD' && styles.opRewardText,
                    ]}
                  >
                    {opVal}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-down"
                size={22}
                color="#94a3b8"
              />
            </Pressable>
            {errors.operation && (
              <Text style={styles.error}>{errors.operation.message}</Text>
            )}

            <OperationPickerModal
              visible={operationModalVisible}
              selectedOperation={opVal}
              onSelect={(op) => {
                setSelectedOperation(op);
                onOpChange(op);
              }}
              onClose={() => setOperationModalVisible(false)}
            />
          </View>
        )}
      />

      {/* Quantity */}
      <View style={styles.field}>
        <Text style={styles.label}>Quantity</Text>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.quantity && styles.inputError]}
              value={value === undefined ? '' : String(value)}
              onChangeText={(text) => {
                const sanitized = text.replace(',', '.');
                onChange(sanitized === '' ? undefined : Number(sanitized));
              }}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="e.g. 10"
              placeholderTextColor="#94a3b8"
            />
          )}
        />
        {errors.quantity && (
          <Text style={styles.error}>{errors.quantity.message}</Text>
        )}
      </View>

      {/* Price with Inline Currency Sub-input */}
      <Controller
        control={control}
        name="price"
        render={({ field: { value: priceVal, onChange: onPriceChange } }) => (
          <Controller
            control={control}
            name="currency"
            render={({
              field: { value: currencyVal, onChange: onCurrencyChange },
            }) => (
              <PriceCurrencyInput
                label="Price per share"
                value={priceVal}
                onChangeValue={onPriceChange}
                currency={currencyVal}
                onChangeCurrency={onCurrencyChange}
                placeholder="e.g. 245.50"
                error={errors.price?.message || errors.currency?.message}
              />
            )}
          />
        )}
      />

      {/* Transaction Date */}
      <Controller
        control={control}
        name="transactionDate"
        render={({ field: { value: dateVal, onChange: onDateChange } }) => (
          <DatePickerField
            label="Transaction date"
            value={dateVal}
            onChange={onDateChange}
            error={errors.transactionDate?.message}
          />
        )}
      />

      {/* Additional / Optional fields section */}
      <View style={styles.optionalSection}>
        <Text style={styles.optionalHeader}>OPTIONAL DETAILS</Text>

        {/* Time added */}
        <View style={styles.field}>
          <Text style={styles.label}>Time added</Text>
          <Controller
            control={control}
            name="transactionTime"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="HH:MM (e.g. 14:30)"
                placeholderTextColor="#94a3b8"
                keyboardType="numbers-and-punctuation"
              />
            )}
          />
        </View>

        {/* Trading Cost */}
        <View style={styles.field}>
          <Text style={styles.label}>Trading cost / fee</Text>
          <Controller
            control={control}
            name="tradingCost"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                value={value === undefined ? '' : String(value)}
                onChangeText={(text) => {
                  const sanitized = text.replace(',', '.');
                  onChange(sanitized === '' ? undefined : Number(sanitized));
                }}
                onBlur={onBlur}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
              />
            )}
          />
        </View>

        {/* Taxes */}
        <View style={styles.field}>
          <Text style={styles.label}>Taxes</Text>
          <Controller
            control={control}
            name="taxes"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                value={value === undefined ? '' : String(value)}
                onChangeText={(text) => {
                  const sanitized = text.replace(',', '.');
                  onChange(sanitized === '' ? undefined : Number(sanitized));
                }}
                onBlur={onBlur}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
              />
            )}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description / Notes</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Add custom notes..."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          createMutation.isPending && styles.submitButtonDisabled,
          pressed && styles.submitButtonPressed,
        ]}
        disabled={createMutation.isPending}
        onPress={handleSubmit(onSubmit)}
      >
        {createMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Add transaction</Text>
        )}
      </Pressable>
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
    gap: 16,
    paddingBottom: 50,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  selectionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  selectionInputPressed: {
    backgroundColor: '#f1f5f9',
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  tickerBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectionMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectionSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  operationSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  operationPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  opBuy: { backgroundColor: '#dcfce7' },
  opBuyText: { color: '#16a34a' },
  opSell: { backgroundColor: '#fee2e2' },
  opSellText: { color: '#dc2626' },
  opDividend: { backgroundColor: '#dbeafe' },
  opDividendText: { color: '#2563eb' },
  opReward: { backgroundColor: '#fef3c7' },
  opRewardText: { color: '#d97706' },
  optionalSection: {
    gap: 14,
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  optionalHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  textArea: {
    minHeight: 80,
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
