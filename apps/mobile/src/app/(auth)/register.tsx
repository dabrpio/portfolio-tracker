import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

import { register } from "@/features/auth/auth.service";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      const user = await register(email, password);

      console.log("Registered:", user.uid);
    } catch (error) {
      console.error(error);

      Alert.alert("Registration failed", "Could not create your account.");
    }
  }

  return (
    <View>
      <Text>Register</Text>

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

      <Button title="Register" onPress={handleRegister} />

      <Link href="/login">Already have an account? Sign in</Link>
    </View>
  );
}
