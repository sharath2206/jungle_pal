import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';
import { SquishyButton } from './SquishyButton';

export const CelebrationModal = ({
  visible,
  title = 'Roaring Success!',
  subtitle = 'You earned 10 Stars & 1 New Badge!',
  emoji = '🎉',
  onClose,
  buttonText = 'Keep Exploring! 🚀',
}) => {
  useEffect(() => {
    if (visible) {
      sounds.playSuccess();
      sounds.playSparkle();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.rewardPills}>
            <View style={styles.rewardPill}>
              <Text style={styles.rewardEmoji}>⭐</Text>
              <Text style={styles.rewardText}>+5 Stars</Text>
            </View>
            <View style={[styles.rewardPill, { backgroundColor: colors.secondaryFixed }]}>
              <Text style={styles.rewardEmoji}>🪙</Text>
              <Text style={styles.rewardText}>+10 Coins</Text>
            </View>
          </View>

          <SquishyButton
            variant="primary"
            size="lg"
            onPress={onClose}
            style={styles.actionBtn}
          >
            {buttonText}
          </SquishyButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(53, 16, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#351000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 12,
  },
  emojiCircle: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainer,
    borderBottomWidth: 5,
    borderBottomColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emojiText: {
    fontSize: 42,
  },
  title: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 26,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
  },
  rewardPills: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  rewardEmoji: {
    fontSize: 18,
  },
  rewardText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '900',
    color: colors.onSurface,
  },
  actionBtn: {
    width: '100%',
  },
});
