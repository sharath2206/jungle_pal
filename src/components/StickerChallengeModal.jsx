import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';
import { SquishyButton } from './SquishyButton';
import { parentalControl } from '../theme/parentalControl';

export const StickerChallengeModal = ({
  visible = false,
  sticker = null,
  onClose,
  onUnlockSuccess,
  onNavigateAlphabet,
  onNavigateNumbers,
  onNavigateWordBuilder,
}) => {
  // Mini challenge interactive state
  const [miniSolved, setMiniSolved] = useState(false);
  const [tappedCount, setTappedCount] = useState(0);

  if (!visible || !sticker) return null;

  const isLocked = sticker.locked && !miniSolved;

  // Real-time progress context
  const dynamicStats = parentalControl.getDynamicStats();
  const wordsCount = dynamicStats.wordsSpelled.length;
  const lettersCount = dynamicStats.lettersMastered.length;

  const handleMiniTap = () => {
    sounds.playTap();
    const nextCount = tappedCount + 1;
    setTappedCount(nextCount);

    if (nextCount >= 3) {
      setMiniSolved(true);
      sounds.playSuccess();
      sounds.playSparkle();
      sounds.playAnimal(sticker.title);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}

      // Unlock persistently
      parentalControl.unlockSticker(sticker.id);
      if (onUnlockSuccess) onUnlockSuccess(sticker.id);

      sounds.speak(`Congratulations! You unlocked the ${sticker.title} badge!`);
    } else {
      sounds.speak(`${nextCount}! Keep tapping!`);
    }
  };

  const handleGoToActivity = () => {
    sounds.playTap();
    onClose();
    if (sticker.id.includes('word') || sticker.id.includes('sloth') || sticker.id.includes('bear') || sticker.id.includes('spelling')) {
      if (onNavigateWordBuilder) onNavigateWordBuilder();
    } else if (sticker.id.includes('number') || sticker.id.includes('count') || sticker.id.includes('banana') || sticker.id.includes('frame') || sticker.id.includes('oasis')) {
      if (onNavigateNumbers) onNavigateNumbers();
    } else {
      if (onNavigateAlphabet) onNavigateAlphabet();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeHeaderRow}>
              <View style={[styles.badgeCircle, { backgroundColor: sticker.color || '#F59E0B' }]}>
                <Text style={styles.badgeEmoji}>{sticker.emoji}</Text>
              </View>
              <View style={styles.badgeTitleColumn}>
                <Text style={styles.categoryTag}>SAFARI CHALLENGE</Text>
                <Text style={styles.badgeTitle}>{sticker.title}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Status Chip */}
          <View style={[styles.statusChip, isLocked ? styles.statusChipLocked : styles.statusChipUnlocked]}>
            <Text style={styles.statusChipEmoji}>{isLocked ? '🔒' : '⭐'}</Text>
            <Text style={[styles.statusChipText, isLocked ? styles.statusChipTextLocked : styles.statusChipTextUnlocked]}>
              {isLocked ? 'Challenge In Progress' : 'Badge Unlocked & Collected!'}
            </Text>
          </View>

          {/* Challenge Description Box */}
          <View style={styles.descriptionBox}>
            <Text style={styles.requirementTitle}>QUEST REQUIREMENT:</Text>
            <Text style={styles.requirementText}>
              {sticker.tag || 'Complete learning adventures to earn this badge!'}
            </Text>
            <Text style={styles.toastQuote}>"{sticker.toast}"</Text>
          </View>

          {/* Real-time Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Current Progress:</Text>
              <Text style={styles.progressValue}>
                {sticker.id.includes('sloth') || sticker.id.includes('word') || sticker.id.includes('bear')
                  ? `${wordsCount} / 5 Words Spelled`
                  : sticker.id.includes('number') || sticker.id.includes('count')
                  ? `${dynamicStats.numberCompleted ? '5 / 5' : '3 / 5'} Numbers Mastered`
                  : `${lettersCount} / 26 Letters Traced`}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      sticker.id.includes('sloth') || sticker.id.includes('word')
                        ? Math.min(100, (wordsCount / 5) * 100)
                        : Math.min(100, (lettersCount / 10) * 100)
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Interactive Quick Mini-Game */}
          {isLocked && (
            <View style={styles.miniGameCard}>
              <View style={styles.miniGameHeader}>
                <Text style={styles.miniGameIcon}>⚡</Text>
                <Text style={styles.miniGameTitle}>Instant Challenge Unlock:</Text>
              </View>
              <Text style={styles.miniGamePrompt}>
                Tap the magic paw 3 times to awaken {sticker.title}!
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleMiniTap}
                style={styles.magicPawBtn}
              >
                <Text style={styles.magicPawEmoji}>🐾</Text>
                <Text style={styles.magicPawText}>
                  Tap Me! ({tappedCount} / 3) ✨
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {isLocked ? (
              <SquishyButton
                variant="primary"
                size="md"
                onPress={handleGoToActivity}
                style={styles.actionBtn}
                icon={<Text style={styles.btnIcon}>🚀</Text>}
              >
                Go to Adventure Zone
              </SquishyButton>
            ) : (
              <SquishyButton
                variant="secondary"
                size="md"
                onPress={() => {
                  sounds.playTap();
                  sticker.onSound();
                }}
                style={styles.actionBtn}
                icon={<Text style={styles.btnIcon}>🔊</Text>}
              >
                Play Badge Voice
              </SquishyButton>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: 22,
    maxWidth: 440,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeTitleColumn: {
    gap: 2,
  },
  categoryTag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  badgeTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  statusChipLocked: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusChipUnlocked: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusChipEmoji: {
    fontSize: 12,
  },
  statusChipText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
  },
  statusChipTextLocked: {
    color: '#92400E',
  },
  statusChipTextUnlocked: {
    color: '#065F46',
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  requirementTitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  requirementText: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  toastQuote: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.primary,
    marginTop: 2,
  },
  progressSection: {
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  progressValue: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  miniGameCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    gap: 6,
    alignItems: 'center',
  },
  miniGameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  miniGameIcon: {
    fontSize: 14,
  },
  miniGameTitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  miniGamePrompt: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 12,
    color: '#1E3A8A',
    textAlign: 'center',
  },
  magicPawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    marginTop: 4,
    cursor: 'pointer',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  magicPawEmoji: {
    fontSize: 18,
  },
  magicPawText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionButtonsRow: {
    width: '100%',
    marginTop: 4,
  },
  actionBtn: {
    width: '100%',
  },
  btnIcon: {
    fontSize: 18,
  },
});
