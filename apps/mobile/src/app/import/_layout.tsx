import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useNavigation } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ImportTransactionProvider } from '@/features/transactions/context/import-context';

export default function AddTransactionLayout() {
  const navigation = useNavigation();

  function handleDismiss() {
    const parent = navigation.getParent();
    if (parent && parent.canGoBack()) {
      parent.goBack();
    } else {
      router.dismissAll();
      router.back();
    }
  }

  const dismissButton = () => (
    <Pressable
      onPress={handleDismiss}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.closeButton}
    >
      <MaterialCommunityIcons name="close" size={24} color="#111" />
    </Pressable>
  );

  return (
    <ImportTransactionProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Select account',
            headerRight: dismissButton,
          }}
        />
        <Stack.Screen
          name="operation"
          options={{
            title: 'Select operation',
            headerRight: dismissButton,
          }}
        />
        <Stack.Screen
          name="asset"
          options={{
            title: 'Select asset',
            headerRight: dismissButton,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: 'Transaction details',
            headerRight: dismissButton,
          }}
        />
        <Stack.Screen
          name="cash-details"
          options={{
            title: 'Cash transaction',
            headerRight: dismissButton,
          }}
        />
      </Stack>
    </ImportTransactionProvider>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: 4,
  },
});

