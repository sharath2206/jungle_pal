import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Compass } from 'lucide-react';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';
import { SquishyButton } from '../components/SquishyButton';

import toucanImg from '../assets/images/toucan_island.png';
import monkeyImg from '../assets/images/monkey_forest.png';
import elephantImg from '../assets/images/elephant_oasis.png';

export const WorldMapScreen = ({
  onNavigateAlphabet,
  onNavigateNumbers,
  onNavigateWordBuilder,
  onAddStars,
  isDailyQuestDone = false,
}) => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { isMuted, toggleMute } = useSoundMute();

  const isDone = isDailyQuestDone || (typeof localStorage !== 'undefined' && !!localStorage.getItem('jungle_daily_quest_completed'));

  const [wordsCompletedCount, setWordsCompletedCount] = useState(() => {
    try {
      const stored = localStorage.getItem('jungle_words_completed');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.length : 1;
      }
      return 1;
    } catch {
      return 1;
    }
  });

  const [numberGoalReached, setNumberGoalReached] = useState(() => {
    try {
      return localStorage.getItem('jungle_number_completed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jungle_words_completed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWordsCompletedCount(parsed.length);
        }
      }
    } catch {}
    try {
      setNumberGoalReached(localStorage.getItem('jungle_number_completed') === 'true');
    } catch {}
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  const handleVoiceHelper = () => {
    if (isMuted) {
      toggleMute();
      setTimeout(() => {
        sounds.playTap();
        sounds.speak("Pick a path to start playing, Leo! Toucan, Milo, and Ellie are waiting for you!");
        triggerToast('"Pick a path to start playing, Leo!" 🦜');
      }, 50);
      return;
    }
    sounds.playTap();
    sounds.speak("Pick a path to start playing, Leo! Toucan, Milo, and Ellie are waiting for you!");
    triggerToast('"Pick a path to start playing, Leo!" 🦜');
  };

  const handleStartAlphabet = () => {
    sounds.playTap();
    sounds.speak("Off to Alphabet Island! Let's explore letters!");
    triggerToast("Traveling to Alphabet Island... 🦜");
    if (onNavigateAlphabet) {
      onNavigateAlphabet();
    }
  };

  const handleStartWordForest = () => {
    sounds.playTap();
    sounds.speak("Off to Word Forest with Milo!");
    triggerToast("Entering Word Forest... 🐒");
    if (onNavigateWordBuilder) {
      onNavigateWordBuilder();
    }
  };

  const handleStartNumberSafari = () => {
    sounds.playTap();
    sounds.speak("Off to Sparkling Oasis to count with Ellie!");
    triggerToast("Traveling to Sparkling Oasis... 🐘");
    if (onNavigateNumbers) {
      onNavigateNumbers();
    }
  };

  const handleQuestPress = () => {
    sounds.playTap();
    if (isDone) {
      sounds.playSparkle();
      sounds.speak("Hooray! Today's Safari Quest is complete! You earned 5 bonus stars!");
      triggerToast('🎉 Daily Safari Quest Complete! +5 Stars!');
    } else {
      sounds.speak("Complete any challenge in Alphabet Island, Number Safari, or Word Forest to complete today's quest!");
      triggerToast('🦁 Solve any jungle challenge to complete today\'s quest!');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Uniform Top Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeDecorCircle1} />
        <View style={styles.welcomeDecorCircle2} />

        <View style={styles.welcomeHeaderRow}>
          <View style={styles.explorerTagRow}>
            <View style={styles.pawBadge}>
              <Compass size={22} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.welcomeTextColumn}>
              <Text style={styles.explorerTag}>SAFARI WORLD</Text>
              <Text style={styles.greetingTitle}>Welcome Jungle Pal 🌴</Text>
            </View>
          </View>

          {/* Voice Helper Audio Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            activeOpacity={0.85}
            onPress={handleVoiceHelper}
            accessibilityLabel={isMuted ? "Unmute and play audio helper" : "Play audio helper"}
          >
            <Text style={styles.voiceIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Safari Quest Card */}
        <TouchableOpacity
          style={[styles.questCard, isDone && styles.questCardDone]}
          activeOpacity={0.9}
          onPress={handleQuestPress}
        >
          <View style={[styles.questStarCircle, isDone && styles.questStarCircleDone]}>
            <Text style={styles.questStarEmoji}>⭐</Text>
          </View>
          <View style={styles.questTextColumn}>
            <View style={styles.questTitleRow}>
              <Text style={styles.questTitle}>Daily Safari Quest</Text>
              <Text style={[styles.questRewardBadge, isDone && styles.questRewardBadgeDone]}>
                {isDone ? '✓ Completed (+5 ⭐)' : '+5 Stars'}
              </Text>
            </View>
            <Text style={styles.questDescription}>
              {isDone
                ? 'All done for today! Amazing safari work, Jungle Pal!'
                : 'Complete any jungle challenge (Letters, Numbers, or Words)!'}
            </Text>
          </View>
          <View style={[styles.questCheckbox, isDone && styles.questCheckboxActive]}>
            <Text style={styles.questCheckmark}>{isDone ? '✓' : ''}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stepping Path & Zone Cards */}
      <View style={styles.zonesWrapper}>
        {/* ZONE 1: Alphabet Island */}
        <View style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <View style={styles.zoneTitleRow}>
              <Text style={styles.zoneIconEmoji}>☀️</Text>
              <Text style={styles.zoneTagText}>ZONE 1 • SUNLIT COAST</Text>
            </View>
            <View style={styles.starRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleStartAlphabet}
            style={styles.imageContainer}
          >
            <Image source={{ uri: toucanImg }} style={styles.zoneImage} resizeMode="cover" />
            <View style={styles.characterPill}>
              <Text style={styles.characterVerified}>✓</Text>
              <Text style={styles.characterName}>Toco the Toucan</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.zoneDetails}>
            <Text style={styles.zoneMainTitle}>Alphabet Island</Text>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Letters Mastered</Text>
              <Text style={styles.progressValuePrimary}>26 / 26 Available</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '100%', backgroundColor: colors.primaryContainer }]} />
            </View>
          </View>

          <SquishyButton
            variant="primary"
            size="lg"
            onPress={handleStartAlphabet}
            style={styles.zoneActionBtn}
            icon={<Text style={styles.btnIcon}>▶</Text>}
          >
            Start Adventure
          </SquishyButton>
        </View>

        {/* Trail Stepping Stones 1 -> 2 */}
        <View style={styles.steppingStonesRow}>
          <TouchableOpacity
            style={styles.stoneDone}
            activeOpacity={0.8}
            onPress={() => {
              sounds.playChime();
              sounds.speak('Step 1 complete! Alphabet mastery in progress!');
              triggerToast('Step 1 Mastered! ✨');
            }}
          >
            <Text style={styles.stoneCheck}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stoneDone}
            activeOpacity={0.8}
            onPress={() => {
              sounds.playChime();
              sounds.speak('Step 2 complete! Great listening!');
              triggerToast('Step 2 Complete! 🌟');
            }}
          >
            <Text style={styles.stoneCheck}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stoneActive}
            activeOpacity={0.8}
            onPress={handleStartWordForest}
          >
            <Text style={styles.stoneActiveEmoji}>🐾</Text>
          </TouchableOpacity>
        </View>

        {/* ZONE 2: Word Forest */}
        <View style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <View style={styles.zoneTitleRow}>
              <Text style={styles.zoneIconEmoji}>🌴</Text>
              <Text style={[styles.zoneTagText, { color: colors.secondary }]}>ZONE 2 • CANOPY TRAIL</Text>
            </View>
            <View style={styles.starRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={[styles.starIcon, { opacity: 0.3 }]}>⭐</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleStartWordForest}
            style={styles.imageContainer}
          >
            <Image source={{ uri: monkeyImg }} style={styles.zoneImage} resizeMode="cover" />
            <View style={styles.characterPill}>
              <Text style={styles.characterHeart}>❤️</Text>
              <Text style={styles.characterName}>Milo the Monkey</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.zoneDetails}>
            <Text style={styles.zoneMainTitle}>Word Forest</Text>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Word Quests</Text>
              <Text style={[styles.progressValuePrimary, { color: colors.secondary }]}>
                {wordsCompletedCount} of 5 Spelled
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, (wordsCompletedCount / 5) * 100)}%`, backgroundColor: colors.secondaryContainer }]} />
            </View>
          </View>

          <SquishyButton
            variant="secondary"
            size="lg"
            onPress={handleStartWordForest}
            style={styles.zoneActionBtn}
            icon={<Text style={styles.btnIcon}>📖</Text>}
          >
            Play Words
          </SquishyButton>
        </View>

        {/* Trail Stepping Stones 2 -> 3 */}
        <View style={styles.steppingStonesRow}>
          <TouchableOpacity
            style={styles.stoneDone}
            activeOpacity={0.8}
            onPress={() => {
              sounds.playChime();
              sounds.speak('Word trail cleared! Good job!');
              triggerToast('Canopy Trail Cleared! 🌴');
            }}
          >
            <Text style={styles.stoneCheck}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stoneActive}
            activeOpacity={0.8}
            onPress={handleStartNumberSafari}
          >
            <Text style={styles.stoneActiveEmoji}>🔓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stoneLocked}
            activeOpacity={0.8}
            onPress={() => {
              sounds.playTap();
              sounds.speak('Locked stone! Finish counting with Ellie to unlock!');
              triggerToast('Locked! Complete Number Safari first 🔒');
            }}
          >
            <Text style={styles.stoneLockedIcon}>🔒</Text>
          </TouchableOpacity>
        </View>

        {/* ZONE 3: Number Safari */}
        <View style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <View style={styles.zoneTitleRow}>
              <Text style={styles.zoneIconEmoji}>💧</Text>
              <Text style={[styles.zoneTagText, { color: colors.tertiary }]}>ZONE 3 • SPARKLING OASIS</Text>
            </View>
            <View style={styles.starRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleStartNumberSafari}
            style={styles.imageContainer}
          >
            <Image source={{ uri: elephantImg }} style={styles.zoneImage} resizeMode="cover" />
            <View style={styles.characterPill}>
              <Text style={styles.characterWater}>🐘</Text>
              <Text style={styles.characterName}>Ellie the Elephant</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.zoneDetails}>
            <Text style={styles.zoneMainTitle}>Number Safari</Text>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Counting Expedition</Text>
              <Text style={[styles.progressValuePrimary, { color: colors.tertiary }]}>
                {numberGoalReached ? '5 / 5 Goal Met ⭐' : 'Stage 1 – 5'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: numberGoalReached ? '100%' : '60%', backgroundColor: colors.tertiaryContainer }]} />
            </View>
          </View>

          <SquishyButton
            variant="tertiary"
            size="lg"
            onPress={handleStartNumberSafari}
            style={styles.zoneActionBtn}
            icon={<Text style={styles.btnIcon}>🧮</Text>}
          >
            Count with Ellie
          </SquishyButton>
        </View>

        {/* ZONE 4: Volcano Valley (Locked) */}
        <TouchableOpacity
          style={styles.lockedZoneCard}
          activeOpacity={0.85}
          onPress={() => {
            sounds.playTap();
            sounds.speak('Volcano Valley will unlock when you earn 6 more stars! Keep exploring Alphabet Island and Word Forest!');
            triggerToast('🌋 Collect 6 more stars to unlock Volcano Valley!');
          }}
        >
          <View style={styles.lockedLeftRow}>
            <View style={styles.lockedCircle}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>
            <View>
              <Text style={styles.lockedTitle}>Zone 4: Volcano Valley</Text>
              <Text style={styles.lockedSubtitle}>Unlocks at 30 Stars (Tap to check)</Text>
            </View>
          </View>
          <View style={styles.starsToGoBadge}>
            <Text style={styles.starsToGoText}>6 to go!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Floating Audio Toast */}
      {showToast && (
        <View style={styles.floatingToast} pointerEvents="none">
          <Text style={styles.toastEmoji}>🦜</Text>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 130,
    maxWidth: 480,
    width: '100%',
    marginHorizontal: 'auto',
  },
  welcomeCard: {
    position: 'relative',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    padding: 18,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  welcomeDecorCircle1: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
  },
  welcomeDecorCircle2: {
    position: 'absolute',
    top: -10,
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  welcomeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    zIndex: 1,
  },
  explorerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pawBadge: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainer,
    borderBottomWidth: 4,
    borderBottomColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawEmoji: {
    fontSize: 22,
  },
  welcomeTextColumn: {
    flex: 1,
  },
  explorerTag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 0.8,
  },
  greetingTitle: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.onSurface,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tertiaryContainer,
    borderBottomWidth: 4,
    borderBottomColor: colors.tertiaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00668A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  voiceIcon: {
    fontSize: 24,
  },
  questCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    cursor: 'pointer',
    zIndex: 1,
  },
  questCardDone: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  questStarCircle: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questStarCircleDone: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  questStarEmoji: {
    fontSize: 18,
  },
  questTextColumn: {
    flex: 1,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  questTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: colors.onSurface,
  },
  questRewardBadge: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: colors.secondary,
    backgroundColor: 'rgba(255, 186, 39, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  questRewardBadgeDone: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  questDescription: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  questCheckbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceVariant,
  },
  questCheckboxActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryDark,
  },
  questCheckmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  zonesWrapper: {
    gap: 24,
  },
  zoneCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: 16,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    gap: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoneIconEmoji: {
    fontSize: 18,
  },
  zoneTagText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  starIcon: {
    fontSize: 13,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: borderRadius.default,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  zoneImage: {
    width: '100%',
    height: '100%',
  },
  characterPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 248, 246, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  characterVerified: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  characterHeart: {
    fontSize: 12,
  },
  characterWater: {
    fontSize: 14,
  },
  characterName: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
  },
  zoneDetails: {
    gap: 4,
  },
  zoneMainTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    color: colors.onSurface,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  progressValuePrimary: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    padding: 2,
    marginTop: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  zoneActionBtn: {
    width: '100%',
    marginTop: 4,
  },
  btnIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  steppingStonesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  stoneDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceVariant,
  },
  stoneCheck: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  stoneActive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.secondaryDark,
  },
  stoneActiveEmoji: {
    fontSize: 16,
  },
  stoneLocked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stoneLockedIcon: {
    fontSize: 13,
  },
  lockedZoneCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.default,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.9,
  },
  lockedLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockedCircle: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockEmoji: {
    fontSize: 18,
  },
  lockedTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: colors.onSurface,
  },
  lockedSubtitle: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  starsToGoBadge: {
    backgroundColor: 'rgba(255, 186, 39, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  starsToGoText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: colors.secondary,
  },
  floatingToast: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
    zIndex: 99,
  },
  toastEmoji: {
    fontSize: 22,
  },
  toastText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
});
