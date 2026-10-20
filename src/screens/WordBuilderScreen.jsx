import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';
import { SquishyButton } from '../components/SquishyButton';
import { CelebrationModal } from '../components/CelebrationModal';

import sleepingLionImg from '../assets/images/lion_sleeping.png';
import bearBarnabyImg from '../assets/images/bear_barnaby.jpg';
import monkeyForestImg from '../assets/images/monkey_forest.png';
import toucanIslandImg from '../assets/images/toucan_island.png';
import zebraZiggyImg from '../assets/images/zebra_ziggy.jpg';
import giraffeGigiImg from '../assets/images/giraffe_gigi.jpg';
import elephantOasisImg from '../assets/images/elephant_oasis.png';
import dolphinDannyImg from '../assets/images/dolphin_danny.jpg';
import flamingoFloraImg from '../assets/images/flamingo_flora.jpg';
import hippoHugoImg from '../assets/images/hippo_hugo.jpg';
import iguanaIggyImg from '../assets/images/iguana_iggy.jpg';
import pandaPipImg from '../assets/images/panda_pip.svg';
import rhinoRoxyImg from '../assets/images/rhino_roxy.jpg';
import slothSammyImg from '../assets/images/sloth_sammy.jpg';
import koalaTreetopImg from '../assets/images/koala_treetop.jpg';
import owlNightImg from '../assets/images/owl_night.jpg';
import whaleWallyImg from '../assets/images/whale_wally.jpg';
import viperVickiImg from '../assets/images/viper_vicki.jpg';
import yakYanniImg from '../assets/images/yak_yanni.jpg';
import alligatorAlexImg from '../assets/images/alligator_alex.jpg';

const ANIMAL_SOUND_MAP = {
  lion: () => sounds.playRoar(),
  bear: () => sounds.playBear(),
  monkey: () => sounds.playMonkey(),
  toucan: () => sounds.playToucan(),
  zebra: () => sounds.playZebra(),
  giraffe: () => sounds.playGiraffe(),
  elephant: () => sounds.playElephant(),
  dolphin: () => sounds.playDolphin(),
  flamingo: () => sounds.playFlamingo(),
  hippo: () => sounds.playHippo(),
  iguana: () => sounds.playIguana(),
  panda: () => sounds.playPanda(),
  rhino: () => sounds.playRhino(),
  sloth: () => sounds.playSloth(),
  koala: () => sounds.playKoala(),
  owl: () => sounds.playOwl(),
  whale: () => sounds.playWhale(),
  viper: () => sounds.playViper(),
  yak: () => sounds.playYak(),
  alligator: () => sounds.playAlligator(),
};

const PUZZLE_WORDS = [
  {
    target: 'LION',
    letters: ['L', 'I', 'O', 'N'],
    initialFilled: 2, // L and I filled
    tiles: [
      { letter: 'O', phonetic: 'Letter O' },
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'B', phonetic: 'Letter B' },
      { letter: 'T', phonetic: 'Letter T' },
    ],
    hint: 'Find letter O!',
    animal: 'Lion 🦁',
    sound: 'lion',
    prompt: 'Find the Lion!',
    image: sleepingLionImg,
    isSleeping: true,
  },
  {
    target: 'BEAR',
    letters: ['B', 'E', 'A', 'R'],
    initialFilled: 2, // B and E filled
    tiles: [
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'R', phonetic: 'Letter R' },
      { letter: 'S', phonetic: 'Letter S' },
      { letter: 'M', phonetic: 'Letter M' },
    ],
    hint: 'Find letter A!',
    animal: 'Bear 🐻',
    sound: 'bear',
    prompt: 'Find the Bear!',
    image: bearBarnabyImg,
    isSleeping: false,
  },
  {
    target: 'MONKEY',
    letters: ['M', 'O', 'N', 'K'],
    initialFilled: 2, // M and O filled
    tiles: [
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'K', phonetic: 'Letter K' },
      { letter: 'P', phonetic: 'Letter P' },
      { letter: 'D', phonetic: 'Letter D' },
    ],
    hint: 'Find letter N!',
    animal: 'Monkey 🐒',
    sound: 'monkey',
    prompt: 'Find the Monkey!',
    image: monkeyForestImg,
    isSleeping: false,
  },
  {
    target: 'TOUCAN',
    letters: ['T', 'O', 'U', 'C'],
    initialFilled: 2, // T and O filled
    tiles: [
      { letter: 'U', phonetic: 'Letter U' },
      { letter: 'C', phonetic: 'Letter C' },
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'L', phonetic: 'Letter L' },
    ],
    hint: 'Find letter U!',
    animal: 'Toucan 🦜',
    sound: 'toucan',
    prompt: 'Find the Toucan!',
    image: toucanIslandImg,
    isSleeping: false,
  },
  {
    target: 'ZEBRA',
    letters: ['Z', 'E', 'B', 'R'],
    initialFilled: 2, // Z and E filled
    tiles: [
      { letter: 'B', phonetic: 'Letter B' },
      { letter: 'R', phonetic: 'Letter R' },
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'K', phonetic: 'Letter K' },
    ],
    hint: 'Find letter B!',
    animal: 'Zebra 🦓',
    sound: 'zebra',
    prompt: 'Find the Zebra!',
    image: zebraZiggyImg,
    isSleeping: false,
  },
  {
    target: 'GIRAFFE',
    letters: ['G', 'I', 'R', 'A'],
    initialFilled: 2,
    tiles: [
      { letter: 'R', phonetic: 'Letter R' },
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'F', phonetic: 'Letter F' },
      { letter: 'T', phonetic: 'Letter T' },
    ],
    hint: 'Find letter R!',
    animal: 'Giraffe 🦒',
    sound: 'giraffe',
    prompt: 'Find the Giraffe!',
    image: giraffeGigiImg,
    isSleeping: false,
  },
  {
    target: 'ELEPHANT',
    letters: ['E', 'L', 'E', 'P'],
    initialFilled: 2,
    tiles: [
      { letter: 'E', phonetic: 'Letter E' },
      { letter: 'P', phonetic: 'Letter P' },
      { letter: 'H', phonetic: 'Letter H' },
      { letter: 'N', phonetic: 'Letter N' },
    ],
    hint: 'Find letter E!',
    animal: 'Elephant 🐘',
    sound: 'elephant',
    prompt: 'Find the Elephant!',
    image: elephantOasisImg,
    isSleeping: false,
  },
  {
    target: 'DOLPHIN',
    letters: ['D', 'O', 'L', 'P'],
    initialFilled: 2,
    tiles: [
      { letter: 'L', phonetic: 'Letter L' },
      { letter: 'P', phonetic: 'Letter P' },
      { letter: 'H', phonetic: 'Letter H' },
      { letter: 'M', phonetic: 'Letter M' },
    ],
    hint: 'Find letter L!',
    animal: 'Dolphin 🐬',
    sound: 'dolphin',
    prompt: 'Find the Dolphin!',
    image: dolphinDannyImg,
    isSleeping: false,
  },
  {
    target: 'FLAMINGO',
    letters: ['F', 'L', 'A', 'M'],
    initialFilled: 2,
    tiles: [
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'M', phonetic: 'Letter M' },
      { letter: 'I', phonetic: 'Letter I' },
      { letter: 'G', phonetic: 'Letter G' },
    ],
    hint: 'Find letter A!',
    animal: 'Flamingo 🦩',
    sound: 'flamingo',
    prompt: 'Find the Flamingo!',
    image: flamingoFloraImg,
    isSleeping: false,
  },
  {
    target: 'HIPPO',
    letters: ['H', 'I', 'P', 'P'],
    initialFilled: 2,
    tiles: [
      { letter: 'P', phonetic: 'Letter P' },
      { letter: 'O', phonetic: 'Letter O' },
      { letter: 'B', phonetic: 'Letter B' },
      { letter: 'K', phonetic: 'Letter K' },
    ],
    hint: 'Find letter P!',
    animal: 'Hippo 🦛',
    sound: 'hippo',
    prompt: 'Find the Hippo!',
    image: hippoHugoImg,
    isSleeping: false,
  },
  {
    target: 'IGUANA',
    letters: ['I', 'G', 'U', 'A'],
    initialFilled: 2,
    tiles: [
      { letter: 'U', phonetic: 'Letter U' },
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'S', phonetic: 'Letter S' },
    ],
    hint: 'Find letter U!',
    animal: 'Iguana 🦎',
    sound: 'iguana',
    prompt: 'Find the Iguana!',
    image: iguanaIggyImg,
    isSleeping: false,
  },
  {
    target: 'PANDA',
    letters: ['P', 'A', 'N', 'D'],
    initialFilled: 2,
    tiles: [
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'D', phonetic: 'Letter D' },
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'T', phonetic: 'Letter T' },
    ],
    hint: 'Find letter N!',
    animal: 'Panda 🐼',
    sound: 'panda',
    prompt: 'Find the Panda!',
    image: pandaPipImg,
    isSleeping: false,
  },
  {
    target: 'RHINO',
    letters: ['R', 'H', 'I', 'N'],
    initialFilled: 2,
    tiles: [
      { letter: 'I', phonetic: 'Letter I' },
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'O', phonetic: 'Letter O' },
      { letter: 'S', phonetic: 'Letter S' },
    ],
    hint: 'Find letter I!',
    animal: 'Rhino 🦏',
    sound: 'rhino',
    prompt: 'Find the Rhino!',
    image: rhinoRoxyImg,
    isSleeping: false,
  },
  {
    target: 'SLOTH',
    letters: ['S', 'L', 'O', 'T'],
    initialFilled: 2,
    tiles: [
      { letter: 'O', phonetic: 'Letter O' },
      { letter: 'T', phonetic: 'Letter T' },
      { letter: 'H', phonetic: 'Letter H' },
      { letter: 'P', phonetic: 'Letter P' },
    ],
    hint: 'Find letter O!',
    animal: 'Sloth 🦥',
    sound: 'sloth',
    prompt: 'Find the Sloth!',
    image: slothSammyImg,
    isSleeping: false,
  },
  {
    target: 'KOALA',
    letters: ['K', 'O', 'A', 'L'],
    initialFilled: 2,
    tiles: [
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'L', phonetic: 'Letter L' },
      { letter: 'B', phonetic: 'Letter B' },
      { letter: 'M', phonetic: 'Letter M' },
    ],
    hint: 'Find letter A!',
    animal: 'Koala 🐨',
    sound: 'koala',
    prompt: 'Find the Koala!',
    image: koalaTreetopImg,
    isSleeping: false,
  },
  {
    target: 'OWL',
    letters: ['O', 'W', 'L'],
    initialFilled: 1, // O filled
    tiles: [
      { letter: 'W', phonetic: 'Letter W' },
      { letter: 'L', phonetic: 'Letter L' },
      { letter: 'N', phonetic: 'Letter N' },
      { letter: 'K', phonetic: 'Letter K' },
    ],
    hint: 'Find letter W!',
    animal: 'Owl 🦉',
    sound: 'owl',
    prompt: 'Find the Owl!',
    image: owlNightImg,
    isSleeping: false,
  },
  {
    target: 'WHALE',
    letters: ['W', 'H', 'A', 'L'],
    initialFilled: 2,
    tiles: [
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'L', phonetic: 'Letter L' },
      { letter: 'E', phonetic: 'Letter E' },
      { letter: 'O', phonetic: 'Letter O' },
    ],
    hint: 'Find letter A!',
    animal: 'Whale 🐋',
    sound: 'whale',
    prompt: 'Find the Whale!',
    image: whaleWallyImg,
    isSleeping: false,
  },
  {
    target: 'VIPER',
    letters: ['V', 'I', 'P', 'E'],
    initialFilled: 2,
    tiles: [
      { letter: 'P', phonetic: 'Letter P' },
      { letter: 'E', phonetic: 'Letter E' },
      { letter: 'R', phonetic: 'Letter R' },
      { letter: 'S', phonetic: 'Letter S' },
    ],
    hint: 'Find letter P!',
    animal: 'Viper 🐍',
    sound: 'viper',
    prompt: 'Find the Viper!',
    image: viperVickiImg,
    isSleeping: false,
  },
  {
    target: 'YAK',
    letters: ['Y', 'A', 'K'],
    initialFilled: 1, // Y filled
    tiles: [
      { letter: 'A', phonetic: 'Letter A' },
      { letter: 'K', phonetic: 'Letter K' },
      { letter: 'T', phonetic: 'Letter T' },
      { letter: 'M', phonetic: 'Letter M' },
    ],
    hint: 'Find letter A!',
    animal: 'Yak 🐂',
    sound: 'yak',
    prompt: 'Find the Yak!',
    image: yakYanniImg,
    isSleeping: false,
  },
  {
    target: 'ALLIGATOR',
    letters: ['A', 'L', 'L', 'I'],
    initialFilled: 2,
    tiles: [
      { letter: 'L', phonetic: 'Letter L' },
      { letter: 'I', phonetic: 'Letter I' },
      { letter: 'G', phonetic: 'Letter G' },
      { letter: 'A', phonetic: 'Letter A' },
    ],
    hint: 'Find letter L!',
    animal: 'Alligator 🐊',
    sound: 'alligator',
    prompt: 'Find the Alligator!',
    image: alligatorAlexImg,
    isSleeping: false,
  },
];

export const WordBuilderScreen = ({ onBack, onAddStars, onTaskCompleted }) => {
  const { isMuted, toggleMute } = useSoundMute();
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = PUZZLE_WORDS[puzzleIndex];

  const getInitialIndices = (puzzle) => {
    return puzzle.initialFilled === 1 ? [0] : [0, 1];
  };

  // Persistent completed words tracking in localStorage
  const [completedWords, setCompletedWords] = useState(() => {
    try {
      const stored = localStorage.getItem('jungle_words_completed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Placed indices in the word
  const [placedIndices, setPlacedIndices] = useState(() => getInitialIndices(PUZZLE_WORDS[0]));
  const [hintActive, setHintActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongShake, setWrongShake] = useState(null);

  const nextRequiredIndex = placedIndices.length;
  const isWordDone = nextRequiredIndex >= currentPuzzle.letters.length;
  const nextTargetLetter = !isWordDone ? currentPuzzle.letters[nextRequiredIndex] : null;

  const handleSpeakerPress = () => {
    sounds.playTap();
    if (isWordDone) {
      sounds.speak(`Roaring Success! You spelled ${currentPuzzle.target}! Great job!`);
    } else {
      sounds.speak(`Find letter ${nextTargetLetter}! What comes next?`);
    }
  };

  const handleSelectPuzzle = (idx) => {
    sounds.playTap();
    setPuzzleIndex(idx);
    setPlacedIndices(getInitialIndices(PUZZLE_WORDS[idx]));
    setHintActive(false);
    setShowCelebration(false);
    sounds.speak(`Spell ${PUZZLE_WORDS[idx].target}!`);
  };

  const handleTilePress = (tileLetter) => {
    sounds.playTap();

    if (tileLetter === nextTargetLetter) {
      sounds.playSuccess();
      const newIndices = [...placedIndices, nextRequiredIndex];
      setPlacedIndices(newIndices);
      setHintActive(false);

      if (newIndices.length >= currentPuzzle.letters.length) {
        // Trigger authentic animal sound from mapping
        const soundFn = ANIMAL_SOUND_MAP[currentPuzzle.sound];
        if (soundFn) {
          soundFn();
        } else {
          sounds.playSparkle();
        }

        sounds.playSparkle();
        sounds.speak(`Awesome! You spelled ${currentPuzzle.target}!`);

        // Record persistent completion
        const nextCompleted = Array.from(new Set([...completedWords, currentPuzzle.target]));
        setCompletedWords(nextCompleted);
        try {
          localStorage.setItem('jungle_words_completed', JSON.stringify(nextCompleted));
        } catch {}

        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch {}

        if (onAddStars) onAddStars(10);
        if (onTaskCompleted) onTaskCompleted();

        setTimeout(() => {
          setShowCelebration(true);
        }, 600);
      } else {
        sounds.speak(`${tileLetter}! Great! What is next?`);
      }
    } else {
      sounds.speak('Try another letter, little explorer!');
      setWrongShake(tileLetter);
      setTimeout(() => setWrongShake(null), 350);
    }
  };

  const handleHint = () => {
    sounds.playTap();
    setHintActive(true);
    if (nextTargetLetter) {
      sounds.speak(`Look for letter ${nextTargetLetter}!`);
    }
  };

  const handleReset = () => {
    sounds.playTap();
    setPlacedIndices(getInitialIndices(currentPuzzle));
    setHintActive(false);
    setShowCelebration(false);
  };

  const handleNextWord = () => {
    setShowCelebration(false);
    const nextIdx = (puzzleIndex + 1) % PUZZLE_WORDS.length;
    setPuzzleIndex(nextIdx);
    setPlacedIndices(getInitialIndices(PUZZLE_WORDS[nextIdx]));
    setHintActive(false);
    sounds.speak(`Next adventure! Spell ${PUZZLE_WORDS[nextIdx].target}!`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Navigation & Stage Counter Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Text style={styles.backIcon}>⬅️</Text>
          <Text style={styles.backText}>Map</Text>
        </TouchableOpacity>

        <View style={styles.stageBadge}>
          <Text style={styles.pawIcon}>🐾</Text>
          <Text style={styles.stageBadgeText}>
            Word {puzzleIndex + 1} of {PUZZLE_WORDS.length}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.soundHelperBtn}
          activeOpacity={0.85}
          onPress={handleSpeakerPress}
        >
          <Text style={styles.soundHelperIcon}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      </View>

      {/* Persistent Word Quest Checklist Tracker */}
      <View style={styles.questTrackerCard}>
        <View style={styles.questTrackerHeader}>
          <Text style={styles.questTrackerTitle}>WORD FOREST QUEST</Text>
          <View style={styles.questProgressTag}>
            <Text style={styles.questProgressTagText}>
              {completedWords.length} / {PUZZLE_WORDS.length} Solved {completedWords.length === PUZZLE_WORDS.length ? '🏆' : '⭐'}
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.questPillsScroll}
        >
          {PUZZLE_WORDS.map((puzzle, idx) => {
            const isCurrent = idx === puzzleIndex;
            const isDone = completedWords.includes(puzzle.target);
            return (
              <TouchableOpacity
                key={puzzle.target}
                activeOpacity={0.8}
                onPress={() => handleSelectPuzzle(idx)}
                style={[
                  styles.questPill,
                  isCurrent && styles.questPillActive,
                  isDone && styles.questPillDone,
                ]}
              >
                <Text style={styles.questPillEmoji}>{puzzle.animal.split(' ')[1] || '🐾'}</Text>
                <Text
                  style={[
                    styles.questPillText,
                    isCurrent && styles.questPillTextActive,
                    isDone && styles.questPillTextDone,
                  ]}
                >
                  {puzzle.target}
                </Text>
                {isDone && <Text style={styles.questCheckmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Storybook Illustration Scene */}
      <View style={styles.sceneCard}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            sounds.playTap();
            const soundFn = ANIMAL_SOUND_MAP[currentPuzzle.sound];
            if (soundFn) {
              soundFn();
            } else {
              sounds.playSparkle();
            }
            sounds.speak(currentPuzzle.animal);
          }}
          style={styles.sceneImageContainer}
        >
          <Image
            source={{ uri: currentPuzzle.image || sleepingLionImg }}
            style={styles.sceneImage}
            resizeMode="cover"
          />

          {/* Floating bubbles: Snoozing Zzz for sleeping lion, joyful sparkles for active pals */}
          {currentPuzzle.isSleeping ? (
            <View style={styles.zzzContainer}>
              <Text style={styles.zzzBig}>Z</Text>
              <Text style={styles.zzzMed}>z</Text>
              <Text style={styles.zzzSmall}>z</Text>
            </View>
          ) : (
            <View style={styles.zzzContainer}>
              <Text style={styles.zzzBig}>✨</Text>
              <Text style={styles.zzzMed}>🌟</Text>
              <Text style={styles.zzzSmall}>✨</Text>
            </View>
          )}

          {/* Target Animal Magnifier Badge */}
          <View style={styles.magnifierBadge}>
            <Text style={styles.magIcon}>🔍</Text>
            <Text style={styles.magText}>{currentPuzzle.prompt}</Text>
          </View>

          {/* Camilo Mascot Speech Bar */}
          <View style={styles.mascotBottomBar}>
            <View style={styles.mascotLeft}>
              <View style={styles.mascotAvatar}>
                <Text style={styles.chameleonEmoji}>🦎</Text>
              </View>
              <View style={styles.mascotSpeechColumn}>
                <Text style={styles.mascotName}>Camilo says:</Text>
                <Text style={styles.mascotSpeech}>
                  "Find <Text style={styles.targetLetterHighlight}>{nextTargetLetter || currentPuzzle.target}</Text>!"
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mascotSpeakerBtn}
              activeOpacity={0.8}
              onPress={handleSpeakerPress}
            >
              <Text style={styles.mascotSpeakerIcon}>{isMuted ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {/* Target Word Slots Container */}
      <View style={styles.slotsCard}>
        <View style={styles.slotsHeader}>
          <View style={styles.slotsTitleRow}>
            <Text style={styles.spellcheckIcon}>📝</Text>
            <Text style={styles.slotsTitle}>Spell: {currentPuzzle.target}</Text>
          </View>
          <View style={styles.slotsCounterBadge}>
            <Text style={styles.slotsStarEmoji}>⭐</Text>
            <Text style={styles.slotsCountText}>
              {placedIndices.length} / {currentPuzzle.letters.length} Letters
            </Text>
          </View>
        </View>

        {/* Dynamic Letter Slots Grid */}
        <View style={styles.slotsGrid}>
          {currentPuzzle.letters.map((letter, idx) => {
            const isPlaced = placedIndices.includes(idx);
            const isTarget = idx === nextRequiredIndex;

            if (isPlaced) {
              return (
                <View key={idx} style={styles.slotPlaced}>
                  <Text style={styles.slotSparkle}>✨</Text>
                  <Text style={styles.slotLetterText}>{letter}</Text>
                  <Text style={styles.slotPhoneticText}>{letter}</Text>
                </View>
              );
            }

            if (isTarget) {
              return (
                <View
                  key={idx}
                  style={[styles.slotTarget, hintActive && styles.slotTargetHint]}
                >
                  <View style={styles.slotPlusCircle}>
                    <Text style={styles.slotPlusText}>+</Text>
                  </View>
                  <Text style={styles.slotTargetLabel}>Tap {letter}</Text>
                </View>
              );
            }

            return (
              <View key={idx} style={styles.slotLocked}>
                <Text style={styles.slotLockIcon}>🔒</Text>
                <Text style={styles.slotLockLabel}>Next</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Letter Tile Choice Tray */}
      <View style={styles.tileTrayCard}>
        <View style={styles.tileTrayHeader}>
          <View style={styles.tileTrayTitleRow}>
            <Text style={styles.touchIcon}>👆</Text>
            <Text style={styles.tileTrayTitle}>Tap the correct letter:</Text>
          </View>
          <View style={styles.choicesCountBadge}>
            <Text style={styles.choicesCountText}>{currentPuzzle.tiles.length} choices</Text>
          </View>
        </View>

        <View style={styles.tilesGrid}>
          {currentPuzzle.tiles.map((tile) => {
            const isTarget = tile.letter === nextTargetLetter;
            const isHinted = hintActive && isTarget;
            const isShaking = wrongShake === tile.letter;

            return (
              <TouchableOpacity
                key={tile.letter}
                activeOpacity={0.8}
                onPress={() => handleTilePress(tile.letter)}
                style={[
                  styles.tileBtn,
                  isTarget && styles.tileBtnTarget,
                  isHinted && styles.tileBtnHinted,
                  isShaking && styles.tileBtnShaking,
                ]}
              >
                <Text
                  style={[
                    styles.tileLetterText,
                    isTarget && styles.tileLetterTextTarget,
                  ]}
                >
                  {tile.letter}
                </Text>
                <Text
                  style={[
                    styles.tilePhoneticText,
                    isTarget && styles.tilePhoneticTextTarget,
                  ]}
                >
                  {tile.phonetic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hint & Reset Utility Controls */}
      <View style={styles.utilityControlsRow}>
        <TouchableOpacity
          style={styles.hintBtn}
          activeOpacity={0.85}
          onPress={handleHint}
        >
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>Free Hint</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.undoBtn}
          activeOpacity={0.85}
          onPress={handleReset}
        >
          <Text style={styles.undoIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        title="Roaring Success!"
        subtitle={`You spelled ${currentPuzzle.target}! You earned 10 Coins and 5 Stars!`}
        emoji={currentPuzzle.animal.split(' ')[1] || '🦁'}
        onClose={handleNextWord}
        buttonText={completedWords.length >= PUZZLE_WORDS.length ? "All Words Solved! 🏆" : "Next Word Puzzle! 🚀"}
      />
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
    paddingTop: 12,
    paddingBottom: 130,
    maxWidth: 480,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceDim,
    cursor: 'pointer',
  },
  backIcon: {
    fontSize: 14,
  },
  backText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceVariant,
  },
  pawIcon: {
    fontSize: 14,
  },
  stageBadgeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  soundHelperBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tertiaryContainer,
    borderBottomWidth: 3,
    borderBottomColor: colors.tertiaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundHelperIcon: {
    fontSize: 16,
  },
  questTrackerCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 183, 3, 0.4)',
    gap: 8,
  },
  questTrackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questTrackerTitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  questProgressTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  questProgressTagText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  questPillsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  questPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(120, 53, 15, 0.15)',
    cursor: 'pointer',
  },
  questPillActive: {
    borderColor: colors.primary,
    backgroundColor: '#ECFDF5',
    transform: [{ scale: 1.04 }],
  },
  questPillDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  questPillEmoji: {
    fontSize: 14,
  },
  questPillText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  questPillTextActive: {
    color: colors.primary,
    fontWeight: '900',
  },
  questPillTextDone: {
    color: '#065F46',
    fontWeight: '900',
  },
  questCheckmark: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
  },
  sceneCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  sceneImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
  zzzContainer: {
    position: 'absolute',
    top: 14,
    left: 18,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  zzzBig: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: colors.secondary,
  },
  zzzMed: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  zzzSmall: {
    fontSize: 11,
    color: colors.secondary,
  },
  magnifierBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceDim,
  },
  magIcon: {
    fontSize: 14,
  },
  magText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  mascotBottomBar: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.default,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mascotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  mascotAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFixed,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chameleonEmoji: {
    fontSize: 20,
  },
  mascotSpeechColumn: {
    flex: 1,
  },
  mascotName: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  mascotSpeech: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurface,
  },
  targetLetterHighlight: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 15,
    fontWeight: '900',
    color: colors.secondary,
  },
  mascotSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tertiaryContainer,
    borderBottomWidth: 3,
    borderBottomColor: colors.tertiaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotSpeakerIcon: {
    fontSize: 16,
  },
  slotsCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderBottomWidth: 5,
    borderBottomColor: colors.surfaceDim,
    gap: 10,
  },
  slotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spellcheckIcon: {
    fontSize: 16,
  },
  slotsTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  slotsCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  slotsStarEmoji: {
    fontSize: 12,
  },
  slotsCountText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.onSurface,
  },
  slotsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  slotPlaced: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slotSparkle: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 11,
  },
  slotLetterText: {
    fontFamily: typography.displayHeroMobile.fontFamily,
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
  },
  slotPhoneticText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  slotTarget: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  slotTargetHint: {
    backgroundColor: colors.secondaryFixed,
    transform: [{ scale: 1.05 }],
  },
  slotPlusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 183, 3, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPlusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  slotTargetLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  slotLocked: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  slotLockIcon: {
    fontSize: 14,
  },
  slotLockLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    color: colors.outline,
    marginTop: 2,
  },
  tileTrayCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceDim,
    gap: 10,
  },
  tileTrayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileTrayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  touchIcon: {
    fontSize: 16,
  },
  tileTrayTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
  },
  choicesCountBadge: {
    backgroundColor: 'rgba(0, 108, 73, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  choicesCountText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  tilesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tileBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 5,
    borderBottomColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileBtnTarget: {
    backgroundColor: colors.secondaryContainer,
    borderBottomColor: colors.secondaryDark,
  },
  tileBtnHinted: {
    transform: [{ scale: 1.1 }],
    borderColor: colors.primary,
    borderWidth: 2,
  },
  tileBtnShaking: {
    transform: [{ translateX: -4 }],
  },
  tileLetterText: {
    fontFamily: typography.displayHeroMobile.fontFamily,
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
  },
  tileLetterTextTarget: {
    color: colors.onSecondaryFixed,
  },
  tilePhoneticText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  tilePhoneticTextTarget: {
    color: colors.onSecondaryFixedVariant,
  },
  utilityControlsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  hintBtn: {
    flex: 1,
    height: 50,
    backgroundColor: colors.secondaryFixed,
    borderBottomWidth: 4,
    borderBottomColor: colors.secondaryFixedDim,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  hintIcon: {
    fontSize: 18,
  },
  hintText: {
    fontFamily: typography.labelLg.fontFamily,
    fontSize: 15,
    fontWeight: '900',
    color: colors.secondary,
  },
  undoBtn: {
    width: 50,
    height: 50,
    backgroundColor: colors.surfaceContainerHigh,
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceDim,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  undoIcon: {
    fontSize: 20,
  },
});
