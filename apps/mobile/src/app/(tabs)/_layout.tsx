import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, VectorIcon } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAccounts } from '@/features/accounts/hooks/use-accounts';
import { useAuth } from '@/features/auth/use-auth';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  if (loading || (user && accountsLoading)) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (accounts && accounts.length === 0) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="net-worth">
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={MaterialCommunityIcons} name="chart-line" />}
        />
        <NativeTabs.Trigger.Label>Net worth</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="analytics">
        <NativeTabs.Trigger.Icon
          src={
            <VectorIcon
              family={MaterialCommunityIcons}
              name="chart-pie-outline"
            />
          }
        />
        <NativeTabs.Trigger.Label>Analytics</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
