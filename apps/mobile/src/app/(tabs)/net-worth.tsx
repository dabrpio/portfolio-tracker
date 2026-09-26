import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const DATA = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 25,
    value: 4875.0,
    change: 0.05,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    quantity: 12,
    value: 6120.0,
    change: -0.02,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    quantity: 30,
    value: 4200.0,
    change: 0.03,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    quantity: 15,
    value: 3150.0,
    change: 2.3,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 18,
    value: 3240.0,
    change: -1.1,
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    quantity: 8,
    value: 4560.0,
    change: 0.75,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    quantity: 10,
    value: 3750.0,
    change: -0.5,
  },
  {
    ticker: "PKO.WA",
    name: "PKO Bank Polski",
    quantity: 100,
    value: 5200.0,
    change: 0.0,
  },
  {
    ticker: "CDR.WA",
    name: "CD Projekt",
    quantity: 40,
    value: 2680.0,
    change: 1.2,
  },
  {
    ticker: "PZU.WA",
    name: "PZU",
    quantity: 80,
    value: 3840.0,
    change: -0.8,
  },
];

interface ItemProps {
  ticker: string;
  name: string;
  quantity: number;
  value: number;
  change: number;
}

const Item = (props: ItemProps) => (
  <View style={styles.positionItem}>
    <View style={styles.positionLogoWrapper}>
      <Image
        source={{
          uri: `https://img.logo.dev/ticker/${props.ticker}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`,
        }}
        style={styles.positionLogo}
      />
    </View>
    <View style={styles.positionDetails}>
      <View>
        <Text style={styles.positionName}>{props.name}</Text>
        <View style={styles.positionTicker}>
          <Text style={styles.positionTickerText}>{props.ticker}</Text>
          <Text style={styles.positionQuantity}>x{props.quantity}</Text>
        </View>
      </View>
      <View>
        <Text>{props.value.toFixed(2)}</Text>
        <Text style={{ color: props.change > 0 ? "green" : "red" }}>
          {Math.abs(props.change).toFixed(2)}%
        </Text>
      </View>
    </View>
  </View>
);

export default function NetWorth() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
    >
      <Text style={styles.title}>Positions</Text>
      {DATA.map((position) => (
        <Item key={position.ticker} {...position} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  positionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  positionLogoWrapper: {
    backgroundColor: "#e2e2eb",
    borderRadius: 100,
    padding: 8,
    width: 36,
    height: 36,
  },
  positionLogo: {
    width: 20,
    height: 20,
  },
  positionDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  positionName: {
    fontWeight: "bold",
  },
  positionTicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  positionTickerText: {
    color: "gray",
    fontSize: 12,
  },
  positionQuantity: {
    backgroundColor: "#e2e2eb",
    borderRadius: 10,
    fontSize: 12,
    paddingHorizontal: 4,
  },
});
