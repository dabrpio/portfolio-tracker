import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function AccountsLayout() {
  function handleDismiss() {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.back();
    }
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Accounts',
          headerRight: () => (
            <Pressable
              onPress={handleDismiss}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="#111" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Add Account',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: 4,
  },
});
