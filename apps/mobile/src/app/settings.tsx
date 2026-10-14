import { logout } from '@/features/auth/auth.service';
import { useAuth } from '@/features/auth/use-auth';
import { queryClient } from '@/lib/query-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  async function handleLogout() {
    try {
      await logout();
      queryClient.clear();
    } catch {
      // silently handle or log error
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarInitial}>{userInitial}</Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {user?.email ?? 'Unknown User'}
            </Text>
            <Text style={styles.profileStatus}>Signed in</Text>
          </View>
        </View>

        {/* Accounts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <Pressable
            onPress={() => router.push('/accounts')}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            accessibilityRole="button"
            accessibilityLabel="Manage Accounts"
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={22}
                color="#0f172a"
              />
            </View>
            <View style={styles.rowDetails}>
              <Text style={styles.rowTitle}>Manage Accounts</Text>
              <Text style={styles.rowSubtitle}>
                Add or edit cash and brokerage accounts
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#94a3b8"
            />
          </Pressable>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={[styles.row, styles.rowDisabled]}>
            <View style={[styles.iconContainer, styles.iconContainerDisabled]}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={22}
                color="#94a3b8"
              />
            </View>
            <View style={styles.rowDetails}>
              <Text style={[styles.rowTitle, styles.textDisabled]}>
                Base Currency
              </Text>
              <Text style={styles.rowSubtitle}>
                Default currency for valuations
              </Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>

          <View style={[styles.row, styles.rowDisabled]}>
            <View style={[styles.iconContainer, styles.iconContainerDisabled]}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={22}
                color="#94a3b8"
              />
            </View>
            <View style={styles.rowDetails}>
              <Text style={[styles.rowTitle, styles.textDisabled]}>
                Appearance
              </Text>
              <Text style={styles.rowSubtitle}>System default</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Log Out"
          >
            <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        {/* App Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Portfolio Tracker v{Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRightSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  profileStatus: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  rowPressed: {
    backgroundColor: '#f1f5f9',
  },
  rowDisabled: {
    opacity: 0.75,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconContainerDisabled: {
    backgroundColor: '#f8fafc',
  },
  rowDetails: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  textDisabled: {
    color: '#94a3b8',
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  logoutButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
  footer: {
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
});
