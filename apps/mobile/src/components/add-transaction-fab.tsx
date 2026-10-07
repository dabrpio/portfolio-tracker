import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AddTransactionFab() {
  const insets = useSafeAreaInsets();

  function handlePress() {
    router.push("/import");
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        {
          bottom: Math.max(insets.bottom, 16) + 16,
        },
        pressed && styles.fabPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
    >
      <MaterialCommunityIcons name="plus" size={24} color="#ffffff" />
      <Text style={styles.text}>Import</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  text: {
    color: "#fff",
    fontSize: 12
  },
});
