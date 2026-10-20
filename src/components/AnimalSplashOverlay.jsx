import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import confetti from 'canvas-confetti';
import { sounds } from '../theme/sounds';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';

// Splash themes dictionary per animal
export const ANIMAL_SPLASH_THEMES = {
  elephant: {
    title: '🌊 WATER SPLASH! 🌊',
    actionText: 'Splish Splash!',
    subtitle: 'Ellie is splashing cool crystal water all over!',
    accentColor: '#0284C7',
    bgGradient: '#E0F2FE',
    particles: ['💧', '💦', '🌊', '🐟', '🫧', '💧', '💦', '🌊'],
    confettiColors: ['#0284C7', '#38BDF8', '#93C5FD', '#FFFFFF'],
    soundFn: () => {
      sounds.playElephant();
      sounds.speak('Splish Splash! Huge water splash with Ellie!', 1.0, 1.1);
    },
  },
  monkey: {
    title: '🍌 BANANA SPLASH! 🍌',
    actionText: 'Banana Feast!',
    subtitle: 'Milo is showered in sweet golden bananas!',
    accentColor: '#D97706',
    bgGradient: '#FEF3C7',
    particles: ['🍌', '🌴', '🥥', '🍌', '🐒', '🍌', '✨', '🍌'],
    confettiColors: ['#F59E0B', '#FBBF24', '#FDE047', '#10B981'],
    soundFn: () => {
      sounds.playMonkey();
      sounds.speak('Banana splash! Delicious golden bananas for Milo!', 1.0, 1.3);
    },
  },
  bear: {
    title: '🍯 HONEY SPLASH! 🍯',
    actionText: 'Sweet Honey!',
    subtitle: 'Barnaby is diving into golden honey pots!',
    accentColor: '#B45309',
    bgGradient: '#FEF3C7',
    particles: ['🍯', '🐝', '🥞', '🍯', '🌻', '🍯', '✨', '🍯'],
    confettiColors: ['#D97706', '#F59E0B', '#FDE68A', '#78350F'],
    soundFn: () => {
      sounds.playBear();
      sounds.speak('Sweet honey splash! Barnaby loves golden honey!', 0.9, 1.2);
    },
  },
  giraffe: {
    title: '🌿 ACACIA LEAF SPLASH! 🌿',
    actionText: 'Treetop Reach!',
    subtitle: 'Gigi reached high and made a golden leaf shower!',
    accentColor: '#059669',
    bgGradient: '#ECFDF5',
    particles: ['🌿', '🦒', '🍃', '☀️', '⭐', '🌿', '🌱', '🍃'],
    confettiColors: ['#10B981', '#34D399', '#FBBF24', '#FFFFFF'],
    soundFn: () => {
      sounds.playGiraffe();
      sounds.speak('Acacia leaf shower! Gigi reached the highest branches!', 1.0, 1.2);
    },
  },
  dolphin: {
    title: '🐬 OCEAN WAVE SPLASH! 🐬',
    actionText: 'Ocean Joy!',
    subtitle: 'Danny leaped high with a sparkling ocean wave!',
    accentColor: '#0284C7',
    bgGradient: '#E0F2FE',
    particles: ['🐬', '🌊', '🫧', '🐚', '🐟', '🌊', '✨', '🫧'],
    confettiColors: ['#0EA5E9', '#38BDF8', '#67E8F9', '#FFFFFF'],
    soundFn: () => {
      sounds.playDolphin();
      sounds.speak('Splash! Ocean waves and bubbles with Danny!', 1.1, 1.3);
    },
  },
  flamingo: {
    title: '🪷 LOTUS LILY SPLASH! 🪷',
    actionText: 'Lagoon Blossom!',
    subtitle: 'Flora is dancing among blooming pink water lilies!',
    accentColor: '#DB2777',
    bgGradient: '#FCE7F3',
    particles: ['🪷', '🦩', '🌸', '🪶', '🌺', '🪷', '✨', '🌸'],
    confettiColors: ['#EC4899', '#F472B6', '#FBCFE8', '#F59E0B'],
    soundFn: () => {
      sounds.playFlamingo();
      sounds.speak('Pink lotus splash! Flora dances with joy!', 1.1, 1.2);
    },
  },
  hippo: {
    title: '🫧 MUD BUBBLE SPLASH! 🫧',
    actionText: 'Muddy Pop!',
    subtitle: 'Hugo popped all the warm mud puddle bubbles!',
    accentColor: '#4F46E5',
    bgGradient: '#EEF2FF',
    particles: ['🫧', '🦛', '💧', '🌿', '🫧', '💦', '🪷', '🫧'],
    confettiColors: ['#6366F1', '#818CF8', '#A5B4FC', '#38BDF8'],
    soundFn: () => {
      sounds.playHippo();
      sounds.speak('Mud bubble pop! Hugo splashes happily in the river!', 0.9, 1.1);
    },
  },
  alligator: {
    title: '💎 RIVER GEM SPLASH! 💎',
    actionText: 'River Sparkle!',
    subtitle: 'Alex unearthed gleaming jungle crystals and spray!',
    accentColor: '#047857',
    bgGradient: '#D1FAE5',
    particles: ['💎', '🐊', '🌊', '💦', '✨', '💎', '🐟', '💎'],
    confettiColors: ['#059669', '#34D399', '#6EE7B7', '#38BDF8'],
    soundFn: () => {
      sounds.playAlligator();
      sounds.speak('River gem splash! Crystal clear river adventure!', 0.9, 1.0);
    },
  },
  zebra: {
    title: '🍉 SAVANNA MELON SPLASH! 🍉',
    actionText: 'Juicy Crunch!',
    subtitle: 'Ziggy smashed sweet striped watermelons in the savanna!',
    accentColor: '#E11D48',
    bgGradient: '#FFE4E6',
    particles: ['🍉', '🦓', '⭐', '🍉', '🌿', '🍉', '✨', '🍉'],
    confettiColors: ['#E11D48', '#FB7185', '#10B981', '#18181B'],
    soundFn: () => {
      sounds.playZebra();
      sounds.speak('Melon crunch splash! Sweet juicy savanna watermelons!', 1.0, 1.2);
    },
  },
  panda: {
    title: '🎋 BAMBOO SPLASH! 🎋',
    actionText: 'Bamboo Crunch!',
    subtitle: 'Pip is showered with sweet green bamboo stalks!',
    accentColor: '#059669',
    bgGradient: '#D1FAE5',
    particles: ['🎋', '🐼', '🍃', '🎍', '🎋', '⭐', '🌱', '🎋'],
    confettiColors: ['#059669', '#10B981', '#6EE7B7', '#18181B'],
    soundFn: () => {
      sounds.playPanda();
      sounds.speak('Bamboo splash! Fresh crunchy bamboo feast!', 1.1, 1.3);
    },
  },
  owl: {
    title: '✨ FIREFLY STARLIGHT SPLASH! ✨',
    actionText: 'Night Glow!',
    subtitle: 'Oliver sparked a shimmering swirl of fireflies and stars!',
    accentColor: '#7C3AED',
    bgGradient: '#EDE9FE',
    particles: ['✨', '🦉', '🌙', '🪲', '⭐', '✨', '🌟', '🪲'],
    confettiColors: ['#8B5CF6', '#A78BFA', '#FBBF24', '#FFFFFF'],
    soundFn: () => {
      sounds.playOwl();
      sounds.speak('Starlight firefly splash! The night sky is glowing bright!', 1.0, 1.2);
    },
  },
  chameleon: {
    title: '🌈 RAINBOW COLOR SPLASH! 🌈',
    actionText: 'Prism Sparkle!',
    subtitle: 'Charlie zapped into brilliant multicolor rainbow sparks!',
    accentColor: '#C026D3',
    bgGradient: '#FAE8FF',
    particles: ['🌈', '🦎', '🐞', '✨', '💎', '🌈', '🎨', '🐞'],
    confettiColors: ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'],
    soundFn: () => {
      sounds.playChameleon();
      sounds.speak('Rainbow color splash! Charlie is glowing with all the colors!', 1.0, 1.4);
    },
  },
  rhino: {
    title: '🌻 WILDFLOWER SPLASH! 🌻',
    actionText: 'Savanna Bloom!',
    subtitle: 'Roxy charged happily through yellow savanna wildflowers!',
    accentColor: '#D97706',
    bgGradient: '#FEF3C7',
    particles: ['🌻', '🦏', '🌼', '☀️', '🌻', '⭐', '🌾', '🌻'],
    confettiColors: ['#F59E0B', '#FBBF24', '#34D399', '#78350F'],
    soundFn: () => {
      sounds.playRhino();
      sounds.speak('Wildflower splash! Golden savanna blooms everywhere!', 1.0, 1.1);
    },
  },
  sloth: {
    title: '🥭 PAPAYA SPLASH! 🥭',
    actionText: 'Sweet Feast!',
    subtitle: 'Sammy woke up for delicious ripe tropical papayas!',
    accentColor: '#EA580C',
    bgGradient: '#FFEDD5',
    particles: ['🥭', '🦥', '🍃', '🥭', '⭐', '🥭', '🌿', '🥭'],
    confettiColors: ['#F97316', '#FDBA74', '#10B981', '#78350F'],
    soundFn: () => {
      sounds.playSloth();
      sounds.speak('Papaya splash! Sammy loves sweet tropical fruits!', 0.9, 1.0);
    },
  },
  lion: {
    title: '☀️ GOLDEN SUNBURST SPLASH! ☀️',
    actionText: 'Royal Roar!',
    subtitle: 'Leo unleashed a golden shower of sunbeams and pawprints!',
    accentColor: '#D97706',
    bgGradient: '#FEF3C7',
    particles: ['☀️', '🦁', '🐾', '👑', '⭐', '☀️', '✨', '🐾'],
    confettiColors: ['#F59E0B', '#FBBF24', '#FDE047', '#B45309'],
    soundFn: () => {
      sounds.playRoar();
      sounds.speak('Golden sunburst splash! King of the jungle power!', 0.9, 1.2);
    },
  },
};

export const AnimalSplashOverlay = ({
  visible = false,
  animalId = 'elephant',
  animalName = 'Ellie the Elephant',
  animalEmoji = '🐘',
  itemEmoji = '💧',
  count = 5,
  onNext,
}) => {
  const [particles, setParticles] = useState([]);
  const [countdown, setCountdown] = useState(3);

  const theme = ANIMAL_SPLASH_THEMES[animalId] || ANIMAL_SPLASH_THEMES.elephant;

  useEffect(() => {
    if (!visible) return;

    // Generate random animated particle positions
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      emoji: theme.particles[i % theme.particles.length],
      left: Math.random() * 85 + 5, // 5% to 90%
      top: Math.random() * 80 + 10,  // 10% to 90%
      size: Math.floor(Math.random() * 24 + 26), // 26px to 50px
      delay: Math.random() * 0.6,
      duration: Math.random() * 1.5 + 1.2,
      rotation: Math.floor(Math.random() * 60 - 30),
    }));
    setParticles(newParticles);
    setCountdown(3);

    // Play themed sounds & speech
    try {
      sounds.playSuccess();
      setTimeout(() => {
        theme.soundFn();
      }, 150);
    } catch {}

    // Fire custom themed confetti
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 },
        colors: theme.confettiColors,
      });
    } catch {}

    // Countdown timer for automatic advance
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, animalId]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.88)' }]}>
        {/* Animated Background Splashing Particles */}
        {particles.map((p) => (
          <View
            key={p.id}
            style={[
              styles.floatingParticle,
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                transform: [{ rotate: `${p.rotation}deg` }],
              },
            ]}
          >
            <Text style={{ fontSize: p.size }}>{p.emoji}</Text>
          </View>
        ))}

        {/* Central Splash Card */}
        <View style={[styles.splashCard, { borderColor: theme.accentColor }]}>
          {/* Top Emoji Mascot Burst */}
          <View style={[styles.mascotHalo, { backgroundColor: theme.bgGradient, borderColor: theme.accentColor }]}>
            <Text style={styles.mascotEmoji}>{animalEmoji}</Text>
            <View style={[styles.itemPill, { backgroundColor: theme.accentColor }]}>
              <Text style={styles.itemPillText}>{count} {itemEmoji}</Text>
            </View>
          </View>

          {/* Splash Header Title */}
          <Text style={[styles.splashTitle, { color: theme.accentColor }]}>
            {theme.title}
          </Text>

          {/* Descriptive Subtitle */}
          <Text style={styles.splashSubtitle}>
            {theme.subtitle}
          </Text>

          {/* Star Reward Banner */}
          <View style={styles.starRewardBanner}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starText}>+5 Safari Stars Added!</Text>
            <Text style={styles.starIcon}>⭐</Text>
          </View>

          {/* Continue / Next Challenge Button with Countdown */}
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: theme.accentColor }]}
            activeOpacity={0.85}
            onPress={() => {
              sounds.playTap();
              if (onNext) onNext();
            }}
          >
            <Text style={styles.nextButtonText}>
              Next Adventure ➡️ {countdown > 0 ? `(${countdown}s)` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingParticle: {
    position: 'absolute',
    pointerEvents: 'none',
    opacity: 0.92,
  },
  splashCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 4,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
    zIndex: 10,
  },
  mascotHalo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  mascotEmoji: {
    fontSize: 52,
  },
  itemPill: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  itemPillText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  splashTitle: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  splashSubtitle: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  starRewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  starIcon: {
    fontSize: 16,
  },
  starText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
  },
  nextButtonText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
