import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, VectorIcon } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useAuth } from "@/features/auth/use-auth";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
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

      <NativeTabs.Trigger name="import">
        <NativeTabs.Trigger.Icon
          src={<VectorIcon family={MaterialCommunityIcons} name="plus" />}
        />
        <NativeTabs.Trigger.Label>Import</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
