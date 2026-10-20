import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';

export const SquishyButton = ({
  children,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'tertiary', 'surface', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon = null,
  rightElement = null,
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    sounds.playTap();
    if (onPress) onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: colors.secondaryContainer,
          borderBottom: colors.secondaryDark,
          text: colors.onSecondaryFixed,
        };
      case 'tertiary':
        return {
          bg: colors.tertiaryContainer,
          borderBottom: colors.tertiaryDark,
          text: colors.onTertiary,
        };
      case 'surface':
        return {
          bg: colors.surfaceContainerLowest,
          borderBottom: colors.surfaceDim,
          text: colors.onSurface,
        };
      case 'primary':
      default:
        return {
          bg: colors.primaryContainer,
          borderBottom: colors.primaryDark,
          text: colors.onPrimary,
        };
    }
  };

  const currentVariant = getVariantStyles();

  const height = size === 'lg' ? 64 : size === 'sm' ? 44 : 54;
  const paddingH = size === 'lg' ? 24 : size === 'sm' ? 14 : 18;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      onClick={handlePress}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: currentVariant.bg,
          borderBottomColor: currentVariant.borderBottom,
          borderBottomWidth: 5,
          minHeight: height,
          paddingHorizontal: paddingH,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {typeof children === 'string' || typeof children === 'number' || (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number' || c == null)) ? (
          <Text
            style={[
              styles.text,
              {
                color: currentVariant.text,
                fontSize: size === 'lg' ? 20 : size === 'sm' ? 14 : 17,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  text: {
    fontFamily: typography.labelLg.fontFamily,
    fontWeight: '800',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 4,
  },
  rightContainer: {
    marginLeft: 'auto',
  },
});
