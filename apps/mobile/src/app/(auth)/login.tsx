import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

import { login } from "@/features/auth/auth.service";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const user = await login(email, password);

      console.log("Logged in:", user.uid);
    } catch (error) {
      console.error(error);

      Alert.alert("Login failed", "Invalid email or password.");
    }
  }

  return (
    <View>
      <Text>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      <Link href="/register">Don&apos;t have an account? Sign up</Link>
    </View>
  );
}
