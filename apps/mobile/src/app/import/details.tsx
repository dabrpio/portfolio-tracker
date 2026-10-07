import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createTransactionSchema,
    type CreateTransaction,
} from "@portfolio-tracker/shared";

export default function TransactionDetailsScreen() {
  const { accountId, ticker } = useLocalSearchParams<{
    accountId: string;
    ticker: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransaction>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      accountId,
      ticker,
      operation: "BUY",
      quantity: undefined,
      price: undefined,
      currency: "USD",
      transactionDate: new Date().toISOString(),
      transactionTime: undefined,
      tradingCost: undefined,
      taxes: undefined,
      description: "",
    },
  });

  function onSubmit(data: CreateTransaction) {
    console.log(data);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.asset}>
        <Text style={styles.assetLabel}>Asset</Text>
        <Text style={styles.assetTicker}>{ticker}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Operation</Text>

        <Controller
          control={control}
          name="operation"
          render={({ field: { value, onChange } }) => (
            <View style={styles.operationRow}>
              <Pressable
                style={[
                  styles.operationButton,
                  value === "BUY" && styles.operationButtonActive,
                ]}
                onPress={() => onChange("BUY")}
              >
                <Text
                  style={[
                    styles.operationText,
                    value === "BUY" && styles.operationTextActive,
                  ]}
                >
                  Buy
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.operationButton,
                  value === "SELL" && styles.operationButtonActive,
                ]}
                onPress={() => onChange("SELL")}
              >
                <Text
                  style={[
                    styles.operationText,
                    value === "SELL" && styles.operationTextActive,
                  ]}
                >
                  Sell
                </Text>
              </Pressable>
            </View>
          )}
        />

        {errors.operation && (
          <Text style={styles.error}>{errors.operation.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Quantity</Text>

        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value === undefined ? "" : String(value)}
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="e.g. 10"
            />
          )}
        />

        {errors.quantity && (
          <Text style={styles.error}>{errors.quantity.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Price</Text>

        <Controller
          control={control}
          name="price"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value === undefined ? "" : String(value)}
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="e.g. 245.50"
            />
          )}
        />

        {errors.price && (
          <Text style={styles.error}>{errors.price.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Currency</Text>

        <Controller
          control={control}
          name="currency"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="characters"
              placeholder="USD"
            />
          )}
        />

        {errors.currency && (
          <Text style={styles.error}>{errors.currency.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Transaction date</Text>

        {/* Date picker będzie tutaj */}
        <Controller
          control={control}
          name="transactionDate"
          render={({ field: { value } }) => (
            <TextInput
              style={styles.input}
              value={new Date(value).toLocaleDateString()}
              editable={false}
            />
          )}
        />

        {errors.transactionDate && (
          <Text style={styles.error}>{errors.transactionDate.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Time added</Text>

        <Controller
          control={control}
          name="transactionTime"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Optional"
              keyboardType="numbers-and-punctuation"
            />
          )}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Trading cost</Text>

        <Controller
          control={control}
          name="tradingCost"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value === undefined ? "" : String(value)}
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="Optional"
            />
          )}
        />

        {errors.tradingCost && (
          <Text style={styles.error}>{errors.tradingCost.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Taxes</Text>

        <Controller
          control={control}
          name="taxes"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              value={value === undefined ? "" : String(value)}
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              placeholder="Optional"
            />
          )}
        />

        {errors.taxes && (
          <Text style={styles.error}>{errors.taxes.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Optional"
              multiline
              textAlignVertical="top"
            />
          )}
        />

        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Add transaction</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  asset: {
    paddingBottom: 8,
  },
  assetLabel: {
    fontSize: 14,
    color: "#666",
  },
  assetTicker: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  operationRow: {
    flexDirection: "row",
    gap: 8,
  },
  operationButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  operationButtonActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  operationText: {
    fontSize: 16,
    fontWeight: "600",
  },
  operationTextActive: {
    color: "#fff",
  },
  textArea: {
    minHeight: 100,
  },
  error: {
    color: "#d00",
    fontSize: 13,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
