import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';

import logoImg from '../assets/images/logo.png';
import leoProfileImg from '../assets/images/leo_profile.png';

export const Header = ({
  subtitle = 'World Map',
  stars = 24,
  streak = '3d',
  showBack = false,
  onBack,
  onProfilePress,
  companionEmoji = '🐆',
}) => {
  const handleStarPress = () => {
    sounds.playSparkle();
    sounds.speak(`You have ${stars} stars! Keep exploring!`);
  };

  const handleStreakPress = () => {
    sounds.playSuccess();
    sounds.speak(`Awesome! ${streak} learning streak!`);
  };

  return (
    <View style={styles.header}>
      {/* Brand logo & titles OR Back button */}
      <View style={styles.brandContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.85}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back to previous screen"
          >
            <Text style={styles.backArrow}>⬅️</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandLeft}>
            <Image
              source={{ uri: logoImg }}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.titleColumn}>
              <Text style={styles.appName}>Jungle Pals</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Gamification Pills & Avatar (Cleaned & Streamlined) */}
      <View style={styles.statsContainer}>
        {/* Star Counter Pill */}
        <TouchableOpacity
          style={styles.pill}
          activeOpacity={0.8}
          onPress={handleStarPress}
        >
          <Text style={styles.pillEmoji}>⭐</Text>
          <Text style={styles.starText}>{stars}</Text>
        </TouchableOpacity>

        {/* Streak Counter Pill */}
        <TouchableOpacity
          style={styles.pill}
          activeOpacity={0.8}
          onPress={handleStreakPress}
        >
          <Text style={styles.pillEmoji}>☀️</Text>
          <Text style={styles.streakText}>{streak}</Text>
        </TouchableOpacity>

        {/* Explorer Profile Avatar with Companion Badge */}
        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={0.85}
          onPress={onProfilePress}
          accessibilityLabel="Open Profile, Settings & Audio Controls"
        >
          <Image
            source={{ uri: leoProfileImg }}
            style={styles.avatar}
          />
          <View style={styles.companionBadge}>
            <Text style={styles.companionBadgeText}>{companionEmoji}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 68,
    backgroundColor: 'rgba(255, 248, 246, 0.98)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(120, 53, 15, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 50,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  appName: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.3,
    lineHeight: 19,
  },
  subtitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceDim,
    cursor: 'pointer',
  },
  backArrow: {
    fontSize: 16,
  },
  backLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurface,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.35)',
    shadowColor: '#7D5800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    cursor: 'pointer',
  },
  soundPill: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
    backgroundColor: '#F0FDF4',
  },
  musicPill: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
    backgroundColor: '#EFF6FF',
    minWidth: 82,
    justifyContent: 'center',
  },
  lockPill: {
    borderColor: 'rgba(147, 51, 234, 0.35)',
    backgroundColor: '#FAF5FF',
  },
  lockPillActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  pillMuted: {
    borderColor: 'rgba(239, 68, 68, 0.45)',
    backgroundColor: '#FEF2F2',
  },
  soundText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: '#065F46',
  },
  lockTextNormal: {
    color: '#7E22CE',
  },
  lockTextActive: {
    color: '#DC2626',
  },
  soundTextMuted: {
    color: '#DC2626',
  },
  pillEmoji: {
    fontSize: 13,
  },
  starText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
  streakText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainer,
    padding: 2,
    borderBottomWidth: 3,
    borderBottomColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  companionBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  companionBadgeText: {
    fontSize: 10,
    lineHeight: 12,
  },
});
