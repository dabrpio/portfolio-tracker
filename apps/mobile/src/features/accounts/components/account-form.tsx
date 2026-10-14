import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createAccountSchema,
  getBrokerByName,
  type Account,
  type CreateAccount,
} from '@portfolio-tracker/shared';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useCreateAccount } from '../hooks/use-create-account';
import { BrokerPickerModal } from './broker-picker-modal';
import { CurrencyPickerModal } from './currency-picker-modal';

interface AccountFormProps {
  submitButtonText?: string;
  onSuccess?: (account: Account) => void;
}

export function AccountForm({
  submitButtonText = 'Create Account',
  onSuccess,
}: AccountFormProps) {
  const [brokerModalVisible, setBrokerModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const { mutateAsync: createAccount, isPending } = useCreateAccount();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateAccount>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'brokerage',
      broker: null,
      currency: 'USD',
    },
  });

  const accountType = useWatch({ control, name: 'type' });
  const selectedBroker = useWatch({ control, name: 'broker' });
  const selectedCurrency = useWatch({ control, name: 'currency' });

  const brokerData = selectedBroker
    ? getBrokerByName(selectedBroker)
    : undefined;
  const brokerLogoUrl = brokerData?.domain
    ? `https://img.logo.dev/${brokerData.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
    : null;

  async function onSubmit(data: CreateAccount) {
    try {
      const created = await createAccount(data);
      onSuccess?.(created);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create account.';
      Alert.alert('Error', message);
    }
  }

  return (
    <View style={styles.form}>
      {/* Account Type */}
      <View style={styles.field}>
        <Text style={styles.label}>Account Type</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <View style={styles.typeRow}>
              <Pressable
                style={[
                  styles.typeButton,
                  value === 'brokerage' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  onChange('brokerage');
                }}
              >
                <MaterialCommunityIcons
                  name="chart-timeline-variant"
                  size={20}
                  color={value === 'brokerage' ? '#fff' : '#444'}
                  style={styles.typeIcon}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    value === 'brokerage' && styles.typeButtonTextActive,
                  ]}
                >
                  Brokerage
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.typeButton,
                  value === 'cash' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  onChange('cash');
                  setValue('broker', null);
                }}
              >
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={20}
                  color={value === 'cash' ? '#fff' : '#444'}
                  style={styles.typeIcon}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    value === 'cash' && styles.typeButtonTextActive,
                  ]}
                >
                  Cash
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>

      {/* Account Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Account Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              placeholder={
                accountType === 'brokerage'
                  ? 'e.g. My Stock Portfolio'
                  : 'e.g. Emergency Fund'
              }
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      </View>

      {/* Broker Picker (only for brokerage) */}
      {accountType === 'brokerage' && (
        <View style={styles.field}>
          <Text style={styles.label}>Broker / Provider</Text>
          <Pressable
            style={styles.pickerTrigger}
            onPress={() => setBrokerModalVisible(true)}
          >
            {brokerLogoUrl ? (
              <View style={styles.selectedBrokerLogo}>
                <Image
                  source={{ uri: brokerLogoUrl }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <MaterialCommunityIcons
                name="bank-outline"
                size={22}
                color="#666"
                style={styles.pickerLeadingIcon}
              />
            )}
            <Text
              style={[
                styles.pickerTriggerText,
                !selectedBroker && styles.placeholderText,
              ]}
            >
              {selectedBroker || 'Select broker (optional)'}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#999"
            />
          </Pressable>
        </View>
      )}

      {/* Currency Picker */}
      <View style={styles.field}>
        <Text style={styles.label}>Base Currency</Text>
        <Pressable
          style={styles.pickerTrigger}
          onPress={() => setCurrencyModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="currency-usd"
            size={22}
            color="#666"
            style={styles.pickerLeadingIcon}
          />
          <Text style={styles.pickerTriggerText}>{selectedCurrency}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
        </Pressable>
        {errors.currency && (
          <Text style={styles.error}>{errors.currency.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <Pressable
        style={[styles.submitButton, isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        )}
      </Pressable>

      {/* Modals */}
      <BrokerPickerModal
        visible={brokerModalVisible}
        selectedBroker={selectedBroker}
        onSelect={(brokerName) => {
          setValue('broker', brokerName);
          // auto-fill account name if empty
          if (!getValues('name')) {
            setValue('name', brokerName);
          }
        }}
        onClose={() => setBrokerModalVisible(false)}
      />

      <CurrencyPickerModal
        visible={currencyModalVisible}
        selectedCurrency={selectedCurrency}
        onSelect={(code) => setValue('currency', code)}
        onClose={() => setCurrencyModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  typeIcon: {
    marginRight: 2,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  pickerLeadingIcon: {
    marginRight: 10,
  },
  selectedBrokerLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 22,
    height: 22,
  },
  pickerTriggerText: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999',
    fontWeight: 'normal',
  },
  error: {
    color: '#d00',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
