import { StyleSheet, Text, View } from "react-native";

export default function Import() {
  return (
    <View style={styles.container}>
      <Text>Import</Text>
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
