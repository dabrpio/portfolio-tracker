import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBrokerByName, type Account } from '@portfolio-tracker/shared';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface AccountItemProps {
  account: Account;
  onPress?: () => void;
  selected?: boolean;
}

export function AccountItem({ account, onPress, selected }: AccountItemProps) {
  const brokerData = account.broker
    ? getBrokerByName(account.broker)
    : undefined;
  const logoUrl = brokerData?.domain
    ? `https://img.logo.dev/${brokerData.domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`
    : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        selected && styles.containerSelected,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <MaterialCommunityIcons
            name={account.type === 'brokerage' ? 'chart-line' : 'cash'}
            size={22}
            color="#555"
          />
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {account.name}
          </Text>
          <View
            style={[
              styles.typeBadge,
              account.type === 'cash'
                ? styles.cashBadge
                : styles.brokerageBadge,
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {account.type === 'brokerage' ? 'Brokerage' : 'Cash'}
            </Text>
          </View>
        </View>

        <View style={styles.subRow}>
          <Text style={styles.currency}>{account.currency}</Text>
          <Text style={styles.balance}>
            {account.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>

      {selected !== undefined ? (
        selected ? (
          <MaterialCommunityIcons name="check-circle" size={24} color="#111" />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={24}
            color="#ccc"
          />
        )
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={22} color="#aaa" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    marginBottom: 10,
  },
  containerSelected: {
    borderColor: '#111',
    backgroundColor: '#f9fafb',
  },
  containerPressed: {
    opacity: 0.85,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logo: {
    width: 26,
    height: 26,
  },
  details: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  brokerageBadge: {
    backgroundColor: '#e0e7ff',
  },
  cashBadge: {
    backgroundColor: '#dcfce7',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currency: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  balance: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
});
