import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { logout } from '@/features/auth/auth.service';
import { useAuth } from '@/features/auth/use-auth';
import { deleteCurrentUser } from '@/features/users/api/users.api';
import { queryClient } from '@/lib/query-client';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  async function handleLogout() {
    try {
      await logout();
      queryClient.clear();
    } catch {
      // silently handle or log error
    }
  }

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteCurrentUser();
      await logout();
      queryClient.clear();
      setDeleteModalVisible(false);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Failed to delete account',
      );
    } finally {
      setIsDeleting(false);
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
              styles.actionButton,
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Log Out"
          >
            <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setDeleteError(null);
              setDeleteModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Delete Account"
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#dc2626"
            />
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </View>

        {/* App Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Portfolio Tracker v{Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) setDeleteModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              if (!isDeleting) setDeleteModalVisible(false);
            }}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={28}
                color="#dc2626"
              />
            </View>

            <Text style={styles.modalTitle}>Delete Account?</Text>
            <Text style={styles.modalMessage}>
              This action is permanent. All your portfolios, accounts, and
              transactions will be permanently deleted. You cannot undo this.
            </Text>

            {deleteError ? (
              <Text style={styles.modalError}>{deleteError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <Pressable
                disabled={isDeleting}
                onPress={() => setDeleteModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalCancelButtonPressed,
                ]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={isDeleting}
                onPress={handleConfirmDelete}
                style={({ pressed }) => [
                  styles.modalDeleteButton,
                  pressed && styles.modalDeleteButtonPressed,
                  isDeleting && styles.buttonDisabled,
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete Forever</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteButtonPressed: {
    backgroundColor: '#fef2f2',
  },
  deleteText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalError: {
    fontSize: 13,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonPressed: {
    backgroundColor: '#e2e8f0',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteButtonPressed: {
    backgroundColor: '#b91c1c',
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
