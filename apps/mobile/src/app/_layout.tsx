import { Stack } from "expo-router";

import { useAuth } from "@/features/auth/use-auth";

export default function RootLayout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
