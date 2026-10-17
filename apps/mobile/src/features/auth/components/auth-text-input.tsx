import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

export interface AuthTextInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  isPassword?: boolean;
  error?: string;
  hint?: string;
}

export const AuthTextInput = forwardRef<TextInput, AuthTextInputProps>(
  function AuthTextInput(
    {
      label,
      iconName,
      isPassword = false,
      error,
      hint,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            Boolean(error) && styles.inputContainerError,
          ]}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={
              error ? '#ef4444' : isFocused ? '#0f172a' : '#94a3b8'
            }
            style={styles.leadingIcon}
          />

          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor="#94a3b8"
            secureTextEntry={isPassword && !passwordVisible}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setPasswordVisible((prev) => !prev)}
              style={({ pressed }) => [
                styles.eyeButton,
                pressed && styles.eyeButtonPressed,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible ? 'Hide password' : 'Show password'
              }
            >
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#64748b"
              />
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <View style={styles.errorRow}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={14}
              color="#ef4444"
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : hint ? (
          <Text style={styles.hintText}>{hint}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputContainerFocused: {
    borderColor: '#0f172a',
    backgroundColor: '#ffffff',
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    height: '100%',
  },
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeButtonPressed: {
    opacity: 0.6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
