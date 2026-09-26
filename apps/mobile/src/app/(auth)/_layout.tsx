import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/use-auth";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Redirect href="/(tabs)/net-worth" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
