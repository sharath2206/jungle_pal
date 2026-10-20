import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';
import { parentalControl } from '../theme/parentalControl';
import { ParentalGateModal } from '../components/ParentalGateModal';
import { StickerChallengeModal } from '../components/StickerChallengeModal';
import { FAVORITE_ANIMALS } from '../theme/footprints';

const STICKER_COLLECTIONS = {
  animals: [
    {
      id: 'lion',
      title: 'Roaring Lion',
      tag: 'Tap to Roar',
      emoji: '🦁',
      color: colors.primaryContainer,
      tagBg: colors.tertiaryFixed,
      tagColor: colors.onTertiaryFixed,
      toast: '🦁 RAWR! Lion power unlocked!',
      locked: false,
      onSound: () => {
        sounds.playRoar();
        sounds.speak('Rawr! I am the king of the jungle!', 0.9, 1.2);
      },
    },
    {
      id: 'monkey',
      title: 'Playful Monkey',
      tag: 'Master of Words',
      emoji: '🐒',
      color: colors.secondaryContainer,
      tagBg: colors.primaryFixed,
      tagColor: colors.onPrimaryFixedVariant,
      toast: '🐒 Ooh ooh aah aah! Word Master!',
      locked: false,
      onSound: () => {
        sounds.playMonkey();
        sounds.speak('Ooh ooh aah aah! Word Master!', 1.0, 1.4);
      },
    },
    {
      id: 'elephant',
      title: 'Wise Elephant',
      tag: 'Numbers 1-10',
      emoji: '🐘',
      color: colors.tertiaryContainer,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: '🐘 Toot! Number champion!',
      locked: false,
      onSound: () => {
        sounds.playElephant();
        sounds.speak('Toot! Number champion!', 0.9, 1.1);
      },
    },
    {
      id: 'toucan',
      title: 'Rainbow Toucan',
      tag: 'Phonics Champ',
      emoji: '🦜',
      color: '#FF6B00',
      tagBg: colors.tertiaryFixed,
      tagColor: colors.onTertiaryFixed,
      toast: '🦜 Squawk! Phonics Champ!',
      locked: false,
      onSound: () => {
        sounds.playToucan();
        sounds.speak('Squawk! Phonics Champ!', 1.1, 1.3);
      },
    },
    {
      id: 'sloth',
      title: 'Sleepy Sloth',
      tag: 'Spell 5 animal words',
      emoji: '🦥',
      color: colors.surfaceDim,
      tagBg: colors.surfaceContainerHighest,
      tagColor: colors.onSurfaceVariant,
      toast: 'Zzz... Spell 5 words to wake the Sloth!',
      locked: true,
      onSound: () => {
        sounds.speak('Zzz... Keep playing Word Forest to wake me up!');
      },
    },
    {
      id: 'cheetah',
      title: 'Golden Cheetah',
      tag: '7-Day streak',
      emoji: '🐆',
      color: colors.surfaceDim,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: 'Keep learning 4 more days for Cheetah!',
      locked: true,
      onSound: () => {
        sounds.speak('Fast as lightning! Reach a 7-day streak to unlock!');
      },
    },
  ],
  alphabet: [
    {
      id: 'letter_l',
      title: 'Letter L Star',
      tag: 'Traced L!',
      emoji: '🔤',
      color: colors.primaryContainer,
      tagBg: colors.primaryFixed,
      tagColor: colors.onPrimaryFixedVariant,
      toast: '🌟 Letter L Mastered!',
      locked: false,
      onSound: () => sounds.speak('Letter L Master! /l/ is for Lion!'),
    },
    {
      id: 'phonics_hero',
      title: 'Phonics Explorer',
      tag: 'Sound Explorer',
      emoji: '🎵',
      color: colors.secondaryContainer,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: '🎵 Phonics Hero Award!',
      locked: false,
      onSound: () => sounds.speak('Phonics Hero! Great pronunciation!'),
    },
    {
      id: 'spelling_pro',
      title: 'Word Builder',
      tag: 'Spelled Lion',
      emoji: '🧩',
      color: colors.tertiaryContainer,
      tagBg: colors.tertiaryFixed,
      tagColor: colors.onTertiaryFixed,
      toast: '🧩 Spelled 3 Words!',
      locked: false,
      onSound: () => sounds.speak('Word Builder Champion! Spelled L I O N!'),
    },
    {
      id: 'abc_trail',
      title: 'ABC Ranger',
      tag: '6 Letters Learned',
      emoji: '🏆',
      color: colors.secondaryContainer,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: '🏆 ABC Ranger Medal!',
      locked: false,
      onSound: () => sounds.speak('ABC Ranger! You know J, K, L, M, N, O!'),
    },
    {
      id: 'reading_owl',
      title: 'Reading Owl',
      tag: 'Complete Zone 2',
      emoji: '🦉',
      color: colors.surfaceDim,
      tagBg: colors.surfaceContainerHighest,
      tagColor: colors.onSurfaceVariant,
      toast: 'Unlocks in Canopy Trail!',
      locked: true,
      onSound: () => sounds.speak('Hoo hoo! Complete Zone 2 to unlock me!'),
    },
    {
      id: 'grammar_bear',
      title: 'Grammar Bear',
      tag: 'Spell 10 Words',
      emoji: '🐻',
      color: colors.surfaceDim,
      tagBg: colors.surfaceContainerHighest,
      tagColor: colors.onSurfaceVariant,
      toast: 'Spell 10 words to unlock Bear!',
      locked: true,
      onSound: () => sounds.speak('Spell 10 animal words to unlock me!'),
    },
  ],
  numbers: [
    {
      id: 'banana_counter',
      title: 'Banana Counter',
      tag: 'Counted 1 to 5',
      emoji: '🍌',
      color: colors.secondaryContainer,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: '🍌 5 Bananas Fed to Milo!',
      locked: false,
      onSound: () => sounds.speak('Banana Counter! 1, 2, 3, 4, 5!'),
    },
    {
      id: 'ten_frame',
      title: 'Ten Frame Star',
      tag: 'Half Full!',
      emoji: '🔟',
      color: colors.primaryContainer,
      tagBg: colors.primaryFixed,
      tagColor: colors.onPrimaryFixedVariant,
      toast: '⭐ Ten Frame Math Star!',
      locked: false,
      onSound: () => sounds.speak('Ten Frame Star! 5 is half of 10!'),
    },
    {
      id: 'oasis_cup',
      title: 'Ellie Math Cup',
      tag: 'Stage 5 Star',
      emoji: '🏆',
      color: colors.tertiaryContainer,
      tagBg: colors.tertiaryFixed,
      tagColor: colors.onTertiaryFixed,
      toast: '🏆 Oasis Math Cup!',
      locked: false,
      onSound: () => sounds.speak('Ellie Math Cup! Elephant power!'),
    },
    {
      id: 'count_20',
      title: 'Number Pro',
      tag: 'Count to 20',
      emoji: '🔢',
      color: colors.surfaceDim,
      tagBg: colors.surfaceContainerHighest,
      tagColor: colors.onSurfaceVariant,
      toast: 'Reach Stage 10 to unlock!',
      locked: true,
      onSound: () => sounds.speak('Keep counting to 20 to unlock Number Pro!'),
    },
  ],
  quests: [
    {
      id: 'daily_quest',
      title: 'Safari Quest Star',
      tag: 'Today Complete',
      emoji: '🌟',
      color: colors.secondaryContainer,
      tagBg: colors.secondaryFixed,
      tagColor: colors.onSecondaryFixed,
      toast: '🌟 Daily Safari Quest Complete!',
      locked: false,
      onSound: () => sounds.speak('Daily Safari Quest completed! +5 Stars!'),
    },
    {
      id: 'streak_3d',
      title: '3-Day Explorer',
      tag: 'Streak Active',
      emoji: '☀️',
      color: colors.primaryContainer,
      tagBg: colors.primaryFixed,
      tagColor: colors.onPrimaryFixedVariant,
      toast: '☀️ 3-Day Learning Streak!',
      locked: false,
      onSound: () => sounds.speak('3-Day Explorer! You learn every day!'),
    },
    {
      id: 'volcano_key',
      title: 'Volcano Key',
      tag: 'Reach 30 Stars',
      emoji: '🌋',
      color: colors.surfaceDim,
      tagBg: colors.surfaceContainerHighest,
      tagColor: colors.onSurfaceVariant,
      toast: 'Need 6 more stars for Volcano Valley!',
      locked: true,
      onSound: () => sounds.speak('Collect 30 stars to unlock Volcano Valley!'),
    },
  ],
};

export const StickerAlbumScreen = ({
  onNavigateAlphabet,
  onNavigateNumbers,
  onNavigateWordBuilder,
  onAddStars,
  initialUnlocked = false,
  onLockParentZone,
  favoriteAnimal = 'cheetah',
  onSelectFavoriteAnimal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('animals');
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [parentsZoneUnlocked, setParentsZoneUnlocked] = useState(initialUnlocked);
  const [autoLockSeconds, setAutoLockSeconds] = useState(60);
  const [screenTimeLimit, setScreenTimeLimit] = useState(parentalControl.getScreenTimeLimit());
  const [isKidLocked, setIsKidLocked] = useState(parentalControl.isKidLockActive());

  // Interactive challenge modal state
  const [selectedChallengeSticker, setSelectedChallengeSticker] = useState(null);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);

  // Live real-time parental stats & session clock
  const [dynamicStats, setDynamicStats] = useState(parentalControl.getDynamicStats());
  const [sessionSecs, setSessionSecs] = useState(parentalControl.getSessionSeconds());

  useEffect(() => {
    if (initialUnlocked) {
      setParentsZoneUnlocked(true);
      setAutoLockSeconds(60);
    } else {
      setParentsZoneUnlocked(false);
    }
  }, [initialUnlocked]);

  // 1-Minute Auto-Lock Timer for child safety
  useEffect(() => {
    if (!parentsZoneUnlocked) return;
    const autoTimer = setInterval(() => {
      setAutoLockSeconds((prev) => {
        if (prev <= 1) {
          setParentsZoneUnlocked(false);
          if (onLockParentZone) onLockParentZone();
          sounds.playTap();
          sounds.speak('Parent Zone locked for child safety.');
          setToastText('🔒 Parent Zone auto-locked for child safety.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(autoTimer);
  }, [parentsZoneUnlocked, onLockParentZone]);

  const handleImmediateLock = () => {
    sounds.playTap();
    setParentsZoneUnlocked(false);
    if (onLockParentZone) onLockParentZone();
    sounds.speak('Parent Zone locked.');
    setToastText('🔒 Parent Zone locked.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSecs(parentalControl.getSessionSeconds());
      setDynamicStats(parentalControl.getDynamicStats());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const safeStats = dynamicStats || {};
  const lettersMastered = safeStats.lettersMastered || ['A', 'B', 'C', 'L', 'M'];
  const numbersCompleted = safeStats.numbersCompleted || ['oasis_5', 'milo_10'];
  const wordsSpelled = safeStats.wordsSpelled || ['LION', 'BEAR'];
  const unlockedStickersList = safeStats.stickersUnlocked || safeStats.unlockedStickers || ['lion', 'monkey', 'letter_l'];
  const starsCount = safeStats.stars || 45;
  const accuracyScore = safeStats.accuracy || 94;

  const { isMuted, toggleMute, isMusicPlaying, toggleMusic } = useSoundMute();

  const handleSoundToggle = () => {
    const nextMuted = toggleMute();
    sounds.playTap();
    if (!nextMuted) {
      sounds.speak('Sound on!');
      setToastText('🔊 Sound FX Enabled');
    } else {
      setToastText('🔇 Sound FX Muted');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleMusicToggle = () => {
    const nextMusic = toggleMusic();
    sounds.playTap();
    sounds.speak(nextMusic ? 'Music playing' : 'Music off');
    setToastText(nextMusic ? '🎵 Music Playing' : '🔇 Music Off');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCompanionSelect = (animalId) => {
    const pal = FAVORITE_ANIMALS[animalId];
    if (!pal) return;
    if (onSelectFavoriteAnimal) {
      onSelectFavoriteAnimal(animalId);
    }
    if (pal.sound === 'lion') sounds.playRoar();
    else if (pal.sound === 'elephant') sounds.playElephant();
    else if (pal.sound === 'monkey') sounds.playMonkey();
    else sounds.playSuccess();

    sounds.speak(pal.speech);
    setToastText(`🐾 Active Pal: ${pal.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const filterTabs = [
    { id: 'animals', label: 'Jungle Animals', emoji: '🦁' },
    { id: 'alphabet', label: 'Alphabet Badges', emoji: '🔤' },
    { id: 'numbers', label: 'Number Trophies', emoji: '🔢' },
    { id: 'quests', label: 'Special Quests', emoji: '🌟' },
  ];

  const currentStickers = STICKER_COLLECTIONS[selectedFilter] || STICKER_COLLECTIONS.animals;

  const handleVoiceHelper = () => {
    if (isMuted) {
      toggleMute();
      setTimeout(() => {
        sounds.playTap();
        sounds.speak("Welcome to your Sticker Album, Leo! Check out all your badges and adventure trophies!");
      }, 50);
      return;
    }
    sounds.playTap();
    sounds.speak("Welcome to your Sticker Album, Leo! Check out all your badges and adventure trophies!");
  };

  const handleStickerTap = (sticker) => {
    sounds.playTap();
    if (sticker.onSound) {
      sticker.onSound();
    }
    // Open full challenge modal
    setSelectedChallengeSticker(sticker);
    setChallengeModalVisible(true);

    setToastText(sticker.toast);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false), 2200;
    });
  };

  const handleOpenGate = () => {
    sounds.playTap();
    setParentGateOpen(true);
  };

  const handleGateSuccess = () => {
    sounds.playSuccess();
    setParentsZoneUnlocked(true);
    setAutoLockSeconds(60);
    setParentGateOpen(false);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
    sounds.speak('Welcome to the Parent Zone!');
  };

  const handleUnlockChallengeSuccess = (stickerId) => {
    setDynamicStats(parentalControl.getDynamicStats());
    if (onAddStars) onAddStars(5);
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Uniform Top Explorer Banner */}
      <View style={styles.backpackCard}>
        <View style={styles.viewBannerDecorCircle1} />
        <View style={styles.viewBannerDecorCircle2} />

        <View style={styles.viewBannerHeaderRow}>
          <View style={styles.viewTagRow}>
            <View style={[styles.viewBadge, { backgroundColor: colors.tertiaryContainer, borderBottomColor: colors.tertiaryDark }]}>
              <Award size={22} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.viewTextColumn}>
              <Text style={styles.viewCategoryTag}>STICKER ALBUM</Text>
              <Text style={styles.viewMainTitle}>Explorer Backpack 🎒</Text>
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

        {/* 3 Backpack Stats + Rank */}
        <View style={styles.statsCardWrapper}>
          <View style={styles.rankBadgeRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankIcon}>🎖️</Text>
              <Text style={styles.rankText}>Rank #1 Ranger</Text>
            </View>
            <Text style={styles.levelTagText}>LEVEL 3 JUNIOR RANGER</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={[styles.statValue, { color: colors.secondary }]}>{starsCount}</Text>
              <Text style={styles.statLabel}>Total Stars</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🏅</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{unlockedStickersList.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🗺️</Text>
              <Text style={[styles.statValue, { color: colors.tertiary }]}>{lettersMastered.length + numbersCompleted.length}</Text>
              <Text style={styles.statLabel}>Adventures</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Audio & Settings Control Card */}
      <View style={styles.settingsControlCard}>
        <View style={styles.settingsHeaderRow}>
          <Text style={styles.settingsCardTitle}>⚙️ AUDIO & SETTINGS</Text>
          <Text style={styles.settingsSubtitle}>Manage sounds & controls</Text>
        </View>

        <View style={styles.audioButtonsRow}>
          {/* Sound FX Toggle Button */}
          <TouchableOpacity
            style={[styles.audioPillBtn, isMuted && styles.audioPillBtnMuted]}
            activeOpacity={0.85}
            onPress={handleSoundToggle}
            accessibilityLabel={isMuted ? "Turn sound on" : "Turn sound off"}
          >
            <Text style={styles.audioBtnEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
            <View style={styles.audioBtnTextCol}>
              <Text style={styles.audioBtnLabel}>Sound FX</Text>
              <Text style={[styles.audioBtnStatus, isMuted && styles.audioBtnStatusMuted]}>
                {isMuted ? 'OFF' : 'ON'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Music Toggle Button */}
          <TouchableOpacity
            style={[styles.audioPillBtn, !isMusicPlaying && styles.audioPillBtnMuted]}
            activeOpacity={0.85}
            onPress={handleMusicToggle}
            accessibilityLabel={isMusicPlaying ? "Turn music off" : "Turn music on"}
          >
            <Text style={styles.audioBtnEmoji}>{isMusicPlaying ? '🎵' : '🔇'}</Text>
            <View style={styles.audioBtnTextCol}>
              <Text style={styles.audioBtnLabel}>Music</Text>
              <Text style={[styles.audioBtnStatus, !isMusicPlaying && styles.audioBtnStatusMuted]}>
                {isMusicPlaying ? 'ON' : 'OFF'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Parental Control Button */}
          <TouchableOpacity
            style={[styles.audioPillBtn, styles.parentLockBtn, parentsZoneUnlocked && styles.parentLockBtnUnlocked]}
            activeOpacity={0.85}
            onPress={parentsZoneUnlocked ? handleImmediateLock : handleOpenGate}
            accessibilityLabel="Parent Zone & Lock Controls"
          >
            <Text style={styles.audioBtnEmoji}>{parentsZoneUnlocked ? '🔓' : '🛡️'}</Text>
            <View style={styles.audioBtnTextCol}>
              <Text style={styles.audioBtnLabel}>Parent Zone</Text>
              <Text style={[styles.audioBtnStatus, { color: parentsZoneUnlocked ? '#15803D' : '#92400E' }]}>
                {parentsZoneUnlocked ? 'Unlocked' : 'PIN Locked'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Choose Your Favorite Jungle Pal Card */}
      <View style={styles.companionCard}>
        <View style={styles.companionHeaderRow}>
          <View style={styles.companionTitleCol}>
            <View style={styles.companionTagBadge}>
              <Text style={styles.companionTagText}>SAFARI COMPANION</Text>
            </View>
            <Text style={styles.companionMainTitle}>🐾 Choose Your Favorite Jungle Pal</Text>
            <Text style={styles.companionSubtitle}>
              Pick your companion! Their footprints will follow you everywhere you tap in the app!
            </Text>
          </View>
        </View>

        <View style={styles.companionGrid}>
          {Object.values(FAVORITE_ANIMALS).map((pal) => {
            const isSelected = favoriteAnimal === pal.id;
            return (
              <TouchableOpacity
                key={pal.id}
                style={[
                  styles.companionTile,
                  isSelected && styles.companionTileSelected,
                ]}
                activeOpacity={0.85}
                onPress={() => handleCompanionSelect(pal.id)}
              >
                {isSelected && (
                  <View style={styles.companionSelectedBadge}>
                    <Text style={styles.companionSelectedCheck}>✓ ACTIVE PAL</Text>
                  </View>
                )}
                <View style={styles.companionAvatarWrapper}>
                  <Text style={styles.companionAvatarEmoji}>{pal.avatar}</Text>
                </View>
                <Text style={styles.companionName}>{pal.name}</Text>
                <Text style={styles.companionTagline} numberOfLines={2}>
                  {pal.tagline}
                </Text>
                {/* Footprint Mini Preview */}
                <View style={styles.companionFootprintPreview}>
                  <div
                    style={{ width: '28px', height: '28px' }}
                    dangerouslySetInnerHTML={{ __html: pal.svgPaw }}
                  />
                  <Text style={[styles.companionFootprintLabel, isSelected && styles.companionFootprintLabelActive]}>
                    {isSelected ? '🐾 Active Tracks' : 'Tap to Pick'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Filter Tabs Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {filterTabs.map((tab) => {
          const isSelected = selectedFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.85}
              onPress={() => {
                sounds.playTap();
                setSelectedFilter(tab.id);
              }}
              style={[
                styles.filterTab,
                isSelected ? styles.filterTabActive : styles.filterTabInactive,
              ]}
            >
              <Text style={styles.filterEmoji}>{tab.emoji}</Text>
              <Text
                style={[
                  styles.filterLabel,
                  isSelected ? styles.filterLabelActive : styles.filterLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Field Notebook Stickers Grid */}
      <View style={styles.notebookCard}>
        <View style={styles.notebookHeader}>
          <View style={styles.notebookTitleRow}>
            <Text style={styles.notebookIcon}>📖</Text>
            <Text style={styles.notebookTitle}>
              {filterTabs.find((f) => f.id === selectedFilter)?.label}
            </Text>
          </View>
          <View style={styles.discoveredBadge}>
            <Text style={styles.discoveredText}>
              {currentStickers.filter((s) => !s.locked || unlockedStickersList.includes(s.id)).length} / {currentStickers.length} Discovered
            </Text>
          </View>
        </View>

        {/* 2x3 Stickers Grid */}
        <View style={styles.stickersGrid}>
          {currentStickers.map((stk) => {
            const isItemLocked = stk.locked && !unlockedStickersList.includes(stk.id);
            return (
              <TouchableOpacity
                key={stk.id}
                activeOpacity={0.8}
                onPress={() => handleStickerTap(stk)}
                style={[
                  styles.stickerTile,
                  isItemLocked && styles.stickerTileLocked,
                ]}
              >
                {/* Top star or lock icon */}
                <View
                  style={[
                    styles.stickerStarBadge,
                    isItemLocked && styles.stickerLockBadge,
                  ]}
                >
                  <Text style={styles.stickerCornerIcon}>
                    {isItemLocked ? '🔒' : '⭐'}
                  </Text>
                </View>

                {/* Big 3D tactile sticker illustration */}
                <View
                  style={[
                    styles.stickerIllustrationCircle,
                    { backgroundColor: stk.color + '22' },
                  ]}
                >
                  <Text style={styles.stickerBigEmoji}>{stk.emoji}</Text>
                </View>

                {/* Sticker titles & sound action tag */}
                <View style={styles.stickerInfoColumn}>
                  <Text style={styles.stickerTitle}>{stk.title}</Text>
                  <View
                    style={[
                      styles.stickerActionTag,
                      { backgroundColor: stk.tagBg },
                    ]}
                  >
                    {!isItemLocked && <Text style={styles.stickerSoundIcon}>🔊</Text>}
                    <Text
                      style={[
                        styles.stickerActionText,
                        { color: stk.tagColor },
                      ]}
                    >
                      {stk.tag}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Parents Zone & Growth Report */}
      <View style={styles.parentsCard}>
        <View style={styles.parentsHeader}>
          <View style={styles.parentsLeft}>
            <Text style={styles.parentsIcon}>👨‍👩‍👧</Text>
            <View>
              <Text style={styles.parentsTitle}>Parents Zone & Report</Text>
              <Text style={styles.parentsSubtitle}>
                Real-time progress, screen time & safety lock
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.parentsLockBtn}
            activeOpacity={0.85}
            onPress={parentsZoneUnlocked ? handleImmediateLock : handleOpenGate}
          >
            <Text style={styles.parentsLockIcon}>
              {parentsZoneUnlocked ? '🔓' : '🔒'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2 Quick Dynamic Summary Tiles */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryTileIcon}>✅</Text>
            <View>
              <Text style={styles.summaryTileLabel}>Phonics Accuracy</Text>
              <Text style={[styles.summaryTileValue, { color: colors.primary }]}>
                {accuracyScore}% Great
              </Text>
            </View>
          </View>

          <View style={styles.summaryTile}>
            <Text style={styles.summaryTileIcon}>⏱️</Text>
            <View>
              <Text style={styles.summaryTileLabel}>Session Screen Time</Text>
              <Text style={[styles.summaryTileValue, { color: colors.tertiary }]}>
                {Math.floor(sessionSecs / 60)}m / {screenTimeLimit}m
              </Text>
            </View>
          </View>
        </View>

        {/* Unlocked Parent Settings Dashboard */}
        {parentsZoneUnlocked && (
          <View style={styles.unlockedDashboard}>
            <View style={styles.dashboardHeaderRow}>
              <Text style={styles.dashboardHeading}>Parental Controls & Insights</Text>
              <View style={styles.autoLockPill}>
                <Text style={styles.autoLockEmoji}>⏱️</Text>
                <Text style={styles.autoLockText}>{autoLockSeconds}s</Text>
              </View>
            </View>

            {/* Quick Re-Lock Bar */}
            <View style={styles.autoLockRow}>
              <Text style={styles.autoLockNote}>Active session auto-locks in {autoLockSeconds}s for safety</Text>
              <TouchableOpacity
                style={styles.lockNowBtn}
                activeOpacity={0.85}
                onPress={handleImmediateLock}
              >
                <Text style={styles.lockNowIcon}>🔒</Text>
                <Text style={styles.lockNowText}>Lock Now</Text>
              </TouchableOpacity>
            </View>

            {/* Daily Screen Limit Setting */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daily Screen Limit:</Text>
              <View style={styles.limitBtnsRow}>
                {[15, 30, 45, 60].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => {
                      sounds.playTap();
                      parentalControl.setScreenTimeLimit(mins);
                      setScreenTimeLimit(mins);
                    }}
                    style={[
                      styles.limitBtn,
                      screenTimeLimit === mins && styles.limitBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.limitBtnText,
                        screenTimeLimit === mins && styles.limitBtnTextActive,
                      ]}
                    >
                      {mins}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Kid Lock Safe Mode Setting */}
            <View style={[styles.settingItem, { marginTop: 10 }]}>
              <Text style={styles.settingLabel}>Child Launch Lock:</Text>
              <TouchableOpacity
                onPress={() => {
                  sounds.playTap();
                  const nextLock = parentalControl.toggleKidLock();
                  setIsKidLocked(nextLock);
                  if (nextLock) {
                    sounds.speak('Child Lock enabled. Unlocking requires your PIN or Pattern.');
                  } else {
                    sounds.speak('Child Lock turned off.');
                  }
                }}
                style={[
                  styles.limitBtn,
                  isKidLocked ? styles.limitBtnActive : { backgroundColor: '#F1F5F9' },
                  { paddingHorizontal: 14 }
                ]}
              >
                <Text
                  style={[
                    styles.limitBtnText,
                    isKidLocked ? styles.limitBtnTextActive : { color: '#475569' }
                  ]}
                >
                  {isKidLocked ? '🔒 Child Lock ON' : '🔓 Child Lock OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Real-Time Learning Breakdown */}
            <View style={styles.reportBreakdown}>
              <Text style={styles.reportItem}>
                • Alphabet Mastery: {lettersMastered.length}/26 Letters Mastered ({lettersMastered.slice(0, 10).join(', ')}{lettersMastered.length > 10 ? '...' : ''})
              </Text>
              <Text style={styles.reportItem}>
                • Math Foundation: {numbersCompleted.length}/10 Stages Mastered
              </Text>
              <Text style={styles.reportItem}>
                • Spelled Words: {wordsSpelled.length > 0 ? wordsSpelled.join(', ') : 'LION, BEAR, MONKEY, ELEPHANT'}
              </Text>
              <Text style={styles.reportItem}>
                • Total Stars Collected: {starsCount} ⭐
              </Text>
              <Text style={styles.reportItem}>
                • Security Gate: 4-Digit Number PIN or 3x3 Pattern Lock Protected
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Floating Peel Toast */}
      {showToast && (
        <View style={styles.floatingToast}>
          <Text style={styles.toastSparkle}>✨</Text>
          <Text style={styles.toastText}>{toastText}</Text>
        </View>
      )}
    </ScrollView>

    {/* Parental Gate Modal with PIN, Pattern, and Math Tabs (isolated from ScrollView) */}
    <ParentalGateModal
      visible={parentGateOpen}
      onSuccess={handleGateSuccess}
      onClose={() => setParentGateOpen(false)}
    />

    {/* Interactive Sticker Challenge Modal (isolated from ScrollView) */}
    <StickerChallengeModal
      visible={challengeModalVisible}
      sticker={selectedChallengeSticker}
      onClose={() => setChallengeModalVisible(false)}
      onUnlockSuccess={handleUnlockChallengeSuccess}
      onNavigateAlphabet={onNavigateAlphabet}
      onNavigateNumbers={onNavigateNumbers}
      onNavigateWordBuilder={onNavigateWordBuilder}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 130,
    maxWidth: 480,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 14,
  },
  backpackCard: {
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
    gap: 14,
  },
  viewBannerDecorCircle1: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
  },
  viewBannerDecorCircle2: {
    position: 'absolute',
    top: -10,
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  viewBannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  viewTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  viewBadge: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTextColumn: {
    flex: 1,
  },
  viewCategoryTag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.tertiary,
    letterSpacing: 0.8,
  },
  viewMainTitle: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    cursor: 'pointer',
  },
  voiceIcon: {
    fontSize: 24,
  },
  statsCardWrapper: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 12,
    gap: 10,
    zIndex: 1,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceVariant,
  },
  rankBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  rankBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 3,
    borderBottomColor: colors.secondaryDark,
  },
  levelTagText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.6,
  },
  rankIcon: {
    fontSize: 14,
  },
  rankText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceDim,
  },
  statEmoji: {
    fontSize: 18,
  },
  statValue: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  statLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  filtersScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    cursor: 'pointer',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
  },
  filterTabInactive: {
    backgroundColor: colors.surfaceContainerHigh,
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceDim,
  },
  filterEmoji: {
    fontSize: 16,
  },
  filterLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '800',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  filterLabelInactive: {
    color: colors.onSurface,
  },
  notebookCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderBottomWidth: 6,
    borderBottomColor: colors.surfaceDim,
    gap: 12,
  },
  notebookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notebookTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notebookIcon: {
    fontSize: 18,
  },
  notebookTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSurface,
  },
  discoveredBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  discoveredText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: colors.onPrimaryFixedVariant,
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stickerTile: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceDim,
    position: 'relative',
    cursor: 'pointer',
  },
  stickerTileLocked: {
    backgroundColor: colors.surfaceContainer,
    borderBottomColor: colors.surfaceVariant,
    opacity: 0.85,
  },
  stickerStarBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerLockBadge: {
    backgroundColor: 'transparent',
  },
  stickerCornerIcon: {
    fontSize: 12,
  },
  stickerIllustrationCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  stickerBigEmoji: {
    fontSize: 36,
  },
  stickerInfoColumn: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  stickerTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurface,
  },
  stickerActionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  stickerSoundIcon: {
    fontSize: 10,
  },
  stickerActionText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
  },
  parentsCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderBottomWidth: 5,
    borderBottomColor: colors.surfaceDim,
    gap: 12,
  },
  parentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parentsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parentsIcon: {
    fontSize: 22,
  },
  parentsTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSurface,
  },
  parentsSubtitle: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  parentsLockBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  parentsLockIcon: {
    fontSize: 18,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryTile: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTileIcon: {
    fontSize: 20,
  },
  summaryTileLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  summaryTileValue: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '900',
  },
  unlockedDashboard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.primaryFixed,
  },
  dashboardHeading: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  dashboardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  autoLockEmoji: {
    fontSize: 11,
  },
  autoLockText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  autoLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  autoLockNote: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: '#78350F',
    flex: 1,
  },
  lockNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    cursor: 'pointer',
  },
  lockNowIcon: {
    fontSize: 12,
  },
  lockNowText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurface,
    fontWeight: '700',
  },
  limitBtnsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  limitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  limitBtnActive: {
    backgroundColor: colors.primaryContainer,
  },
  limitBtnText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.onSurface,
  },
  limitBtnTextActive: {
    color: '#FFFFFF',
  },
  reportBreakdown: {
    paddingTop: 4,
    gap: 3,
  },
  reportItem: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  floatingToast: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#7D5800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  toastSparkle: {
    fontSize: 16,
  },
  toastText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(53, 16, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  gateCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 20,
    gap: 12,
    shadowColor: '#351000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
  },
  gateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gateShield: {
    fontSize: 22,
  },
  gateTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: colors.onSurface,
  },
  gateCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateCloseText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: 'bold',
  },
  gatePrompt: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  mathChallengeBox: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.default,
    paddingVertical: 14,
    alignItems: 'center',
  },
  mathChallengeText: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 28,
    fontWeight: '900',
    color: colors.onSurface,
    letterSpacing: 2,
  },
  mathOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mathOptionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.default,
    alignItems: 'center',
    cursor: 'pointer',
  },
  mathOptionDefault: {
    backgroundColor: colors.surfaceContainer,
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceDim,
  },
  mathOptionCorrect: {
    backgroundColor: colors.primary,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
  },
  mathOptionText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    color: colors.onSurface,
  },
  mathOptionTextCorrect: {
    color: '#FFFFFF',
  },
  gateErrorText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Audio & Settings Control Card Styles
  settingsControlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.large,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(120, 53, 15, 0.12)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(120, 53, 15, 0.25)',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  settingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 53, 15, 0.08)',
    paddingBottom: 8,
  },
  settingsCardTitle: {
    fontFamily: typography.labelLg.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: '#78350F',
    letterSpacing: 1,
  },
  settingsSubtitle: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  audioButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  audioPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderBottomWidth: 3.5,
    borderBottomColor: '#22C55E',
    borderRadius: borderRadius.default,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 8,
    justifyContent: 'center',
  },
  audioPillBtnMuted: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderBottomColor: '#9CA3AF',
  },
  parentLockBtn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderBottomColor: '#F59E0B',
  },
  parentLockBtnUnlocked: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderBottomColor: '#10B981',
  },
  audioBtnEmoji: {
    fontSize: 20,
  },
  audioBtnTextCol: {
    alignItems: 'flex-start',
  },
  audioBtnLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.onSurface,
  },
  audioBtnStatus: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
  },
  audioBtnStatusMuted: {
    color: '#6B7280',
  },

  // Choose Your Favorite Jungle Pal Card Styles
  companionCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: borderRadius.large,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FDE68A',
    borderBottomWidth: 5,
    borderBottomColor: '#F59E0B',
    gap: 14,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  companionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companionTitleCol: {
    flex: 1,
    gap: 4,
  },
  companionTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  companionTagText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  companionMainTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#78350F',
  },
  companionSubtitle: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  companionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  companionTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.default,
    padding: 12,
    borderWidth: 2,
    borderColor: 'rgba(120, 53, 15, 0.12)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(120, 53, 15, 0.22)',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  companionTileSelected: {
    borderColor: '#F59E0B',
    borderBottomColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  companionSelectedBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  companionSelectedCheck: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  companionAvatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  companionAvatarEmoji: {
    fontSize: 28,
  },
  companionName: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: '#78350F',
    textAlign: 'center',
  },
  companionTagline: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
  },
  companionFootprintPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    justifyContent: 'center',
  },
  companionFootprintLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  companionFootprintLabelActive: {
    color: '#D97706',
    fontWeight: '900',
  },
});
