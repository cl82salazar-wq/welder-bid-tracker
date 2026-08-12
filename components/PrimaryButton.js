import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radii, spacing } from '../constants/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isSecondary && styles.secondary,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost || isSecondary ? colors.accent : colors.bg} />
      ) : (
        <Text
          style={[
            styles.text,
            (isSecondary || isGhost) && styles.textAccent,
            isDanger && styles.textDanger,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger + '22',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.bg,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  textAccent: {
    color: colors.text,
  },
  textDanger: {
    color: colors.danger,
  },
});
