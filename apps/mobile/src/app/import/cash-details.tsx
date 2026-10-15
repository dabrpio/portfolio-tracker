import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
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
import { PriceCurrencyInput } from '@/features/transactions/components/price-currency-input';
import { useImportTransaction } from '@/features/transactions/context/import-context';
import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction';
import {
  BROKERS,
  createCashTransactionSchema,
  type CashOperation,
  type CreateCashTransaction,
} from '@portfolio-tracker/shared';

export default function CashDetailsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    accountId?: string;
    operation?: CashOperation;
  }>();

  const { data: accounts } = useAccounts();
  const {
    selectedAccountId,
    selectedOperation,
    setSelectedAccountId,
    setSelectedOperation,
    reset: resetImportContext,
  } = useImportTransaction();

  const createMutation = useCreateTransaction();

  useEffect(() => {
    if (params.accountId && !selectedAccountId) {
      setSelectedAccountId(params.accountId);
    }
  }, [params.accountId, selectedAccountId, setSelectedAccountId]);

  const activeAccountId = selectedAccountId || params.accountId || '';
  const activeAccount = accounts?.find((acc) => acc.id === activeAccountId);
  const activeOperation =
    (selectedOperation as CashOperation) ||
    params.operation ||
    'DEPOSIT';

  const defaultCurrency = activeAccount?.currency || 'USD';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCashTransaction>({
    resolver: zodResolver(createCashTransactionSchema),
    defaultValues: {
      accountId: activeAccountId,
      operation: activeOperation,
      amount: undefined,
      currency: defaultCurrency,
      transactionDate: new Date().toISOString(),
      transactionTime: undefined,
      description: '',
    },
  });

  useEffect(() => {
    if (selectedAccountId) {
      setValue('accountId', selectedAccountId, { shouldValidate: true });
    }
  }, [selectedAccountId, setValue]);

  useEffect(() => {
    if (
      selectedOperation === 'DEPOSIT' ||
      selectedOperation === 'WITHDRAWAL'
    ) {
      setValue('operation', selectedOperation, { shouldValidate: true });
    }
  }, [selectedOperation, setValue]);

  function handleSelectAccountPress() {
    router.push({
      pathname: '/import',
      params: { returnTo: 'cash-details' },
    });
  }

  function onSubmit(data: CreateCashTransaction) {
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

  const brokerMeta = BROKERS.find((b) => b.name === activeAccount?.broker);
  const brokerLogoUrl = brokerMeta?.domain
    ? `https://img.logo.dev/${brokerMeta.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
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
              {activeAccount?.currency && (
                <Text style={styles.selectionSubText}>
                  {activeAccount.broker || 'Cash Account'} •{' '}
                  {activeAccount.currency}
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

      {/* Operation Selection Segment */}
      <View style={styles.field}>
        <Text style={styles.label}>Operation</Text>
        <Controller
          control={control}
          name="operation"
          render={({ field: { value: opValue, onChange: onOpChange } }) => (
            <View style={styles.segmentRow}>
              <Pressable
                style={[
                  styles.segmentButton,
                  opValue === 'DEPOSIT' && styles.segmentButtonDepositActive,
                ]}
                onPress={() => {
                  setSelectedOperation('DEPOSIT');
                  onOpChange('DEPOSIT');
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-down-circle"
                  size={18}
                  color={opValue === 'DEPOSIT' ? '#16a34a' : '#64748b'}
                />
                <Text
                  style={[
                    styles.segmentText,
                    opValue === 'DEPOSIT' && styles.segmentTextDepositActive,
                  ]}
                >
                  Deposit
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentButton,
                  opValue === 'WITHDRAWAL' &&
                    styles.segmentButtonWithdrawalActive,
                ]}
                onPress={() => {
                  setSelectedOperation('WITHDRAWAL');
                  onOpChange('WITHDRAWAL');
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-up-circle"
                  size={18}
                  color={opValue === 'WITHDRAWAL' ? '#dc2626' : '#64748b'}
                />
                <Text
                  style={[
                    styles.segmentText,
                    opValue === 'WITHDRAWAL' &&
                      styles.segmentTextWithdrawalActive,
                  ]}
                >
                  Withdrawal
                </Text>
              </Pressable>
            </View>
          )}
        />
        {errors.operation && (
          <Text style={styles.error}>{errors.operation.message}</Text>
        )}
      </View>

      {/* Amount with Inline Currency */}
      <Controller
        control={control}
        name="amount"
        render={({ field: { value: amountVal, onChange: onAmountChange } }) => (
          <Controller
            control={control}
            name="currency"
            render={({
              field: { value: currencyVal, onChange: onCurrencyChange },
            }) => (
              <PriceCurrencyInput
                label="Amount"
                value={amountVal}
                onChangeValue={onAmountChange}
                currency={currencyVal}
                onChangeCurrency={onCurrencyChange}
                placeholder="0.00"
                error={errors.amount?.message || errors.currency?.message}
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

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description / Notes (Optional)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. Monthly salary, ATM withdrawal..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
            />
          )}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <Controller
        control={control}
        name="operation"
        render={({ field: { value: opVal } }) => (
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
              <Text style={styles.submitButtonText}>
                {opVal === 'DEPOSIT' ? 'Add deposit' : 'Add withdrawal'}
              </Text>
            )}
          </Pressable>
        )}
      />
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
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  segmentButtonDepositActive: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  segmentButtonWithdrawalActive: {
    borderColor: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentTextDepositActive: {
    color: '#16a34a',
    fontWeight: '700',
  },
  segmentTextWithdrawalActive: {
    color: '#dc2626',
    fontWeight: '700',
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
