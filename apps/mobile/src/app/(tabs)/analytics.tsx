import { StyleSheet, Text, View } from "react-native";

import { AddTransactionFab } from "@/components/add-transaction-fab";

export default function Analytics() {
  return (
    <View style={styles.container}>
      <Text>Analytics</Text>
      <AddTransactionFab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
