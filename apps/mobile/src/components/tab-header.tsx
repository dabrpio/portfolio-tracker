import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/use-auth';

interface TabHeaderProps {
  title: string;
  onProfilePress?: () => void;
}

export function TabHeader({ title, onProfilePress }: TabHeaderProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>{title}</Text>

      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [
          styles.avatarButton,
          pressed && styles.avatarPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="User profile"
        hitSlop={8}
      >
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
