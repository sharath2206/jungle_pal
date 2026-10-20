import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Hash, Sparkles, Shuffle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';
import { SquishyButton } from '../components/SquishyButton';
import { CelebrationModal } from '../components/CelebrationModal';
import { AnimalSplashOverlay } from '../components/AnimalSplashOverlay';
import { parentalControl } from '../theme/parentalControl';

import elephantOasisImg from '../assets/images/elephant_oasis.png';
import miloBananaImg from '../assets/images/milo_banana.png';

const NUMBER_WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve'
];

// Pre-defined missing number sequences
const MISSING_SEQUENCES = [
  { sequence: [1, 2, null, 4, 5], missingIndex: 2, answer: 3, options: [2, 3, 5] },
  { sequence: [2, 3, 4, null, 6], missingIndex: 3, answer: 5, options: [4, 5, 7] },
  { sequence: [null, 2, 3, 4, 5], missingIndex: 0, answer: 1, options: [1, 2, 0] },
  { sequence: [5, 6, null, 8, 9], missingIndex: 2, answer: 7, options: [6, 7, 8] },
  { sequence: [6, 7, 8, null, 10], missingIndex: 3, answer: 9, options: [7, 9, 10] },
  { sequence: [4, 5, 6, 7, null], missingIndex: 4, answer: 8, options: [8, 9, 6] },
];

// Pre-defined addition puzzles
const ADDITION_PUZZLES = [
  { a: 2, b: 3, sum: 5, emojiA: '🌺', emojiB: '🌸', options: [4, 5, 6] },
  { a: 3, b: 3, sum: 6, emojiA: '🌼', emojiB: '🌻', options: [5, 6, 7] },
  { a: 1, b: 4, sum: 5, emojiA: '🦋', emojiB: '🐝', options: [3, 5, 6] },
  { a: 4, b: 2, sum: 6, emojiA: '🥥', emojiB: '🥭', options: [5, 6, 8] },
  { a: 2, b: 5, sum: 7, emojiA: '🌴', emojiB: '🌿', options: [6, 7, 8] },
  { a: 5, b: 3, sum: 8, emojiA: '🍉', emojiB: '🍌', options: [7, 8, 9] },
  { a: 4, b: 4, sum: 8, emojiA: '🪷', emojiB: '🌷', options: [7, 8, 10] },
];

// 24 DISTINCT ANIMAL NUMBER SAFARI CHALLENGES
export const NUMBER_SAFARI_CHALLENGES = [
  {
    id: 'elephant',
    animalName: 'Ellie the Elephant',
    animalEmoji: '🐘',
    title: 'Ellie Oasis Splash 🐘',
    subtitle: 'Tap 5 crystal water droplets to splash in the oasis!',
    targetCount: 5,
    itemEmoji: '💧',
    itemLabel: 'Water Drop',
    accentColor: '#0284C7',
    bgLight: '#E0F2FE',
    voicePrompt: 'Count with Ellie! Tap the 5 crystal water droplets to make a huge oasis splash!',
    image: elephantOasisImg,
    onAnimalSound: () => sounds.playElephant(),
  },
  {
    id: 'monkey',
    animalName: 'Milo the Monkey',
    animalEmoji: '🐒',
    title: 'Milo Banana Grove 🍌',
    subtitle: 'Feed 10 sweet golden bananas to Milo!',
    targetCount: 10,
    itemEmoji: '🍌',
    itemLabel: 'Banana',
    accentColor: '#D97706',
    bgLight: '#FEF3C7',
    voicePrompt: 'Count up to 10 with Milo in the Banana Grove! Tap each golden banana!',
    image: miloBananaImg,
    onAnimalSound: () => sounds.playMonkey(),
  },
  {
    id: 'bear',
    animalName: 'Barnaby the Bear',
    animalEmoji: '🐻',
    title: 'Barnaby Honey Pots 🍯',
    subtitle: 'Collect 6 sweet honey jars for Barnaby!',
    targetCount: 6,
    itemEmoji: '🍯',
    itemLabel: 'Honey Pot',
    accentColor: '#B45309',
    bgLight: '#FEF3C7',
    voicePrompt: 'Barnaby is hungry! Help count and gather 6 sweet golden honey jars!',
    onAnimalSound: () => sounds.playBear(),
  },
  {
    id: 'giraffe',
    animalName: 'Gigi the Giraffe',
    animalEmoji: '🦒',
    title: 'Gigi High Acacia 🌿',
    subtitle: 'Count 7 acacia leaves in the high branches!',
    targetCount: 7,
    itemEmoji: '🌿',
    itemLabel: 'Acacia Leaf',
    accentColor: '#059669',
    bgLight: '#D1FAE5',
    voicePrompt: 'Look up high! Tap 7 fluttering acacia leaves for Gigi!',
    onAnimalSound: () => sounds.playGiraffe(),
  },
  {
    id: 'dolphin',
    animalName: 'Danny the Dolphin',
    animalEmoji: '🐬',
    title: 'Danny Ocean Waves 🌊',
    subtitle: 'Count 8 leaping ocean fish with Danny!',
    targetCount: 8,
    itemEmoji: '🐟',
    itemLabel: 'Ocean Fish',
    accentColor: '#0284C7',
    bgLight: '#E0F2FE',
    voicePrompt: 'Dive into the ocean! Count 8 sparkling fish swimming with Danny!',
    onAnimalSound: () => sounds.playDolphin(),
  },
  {
    id: 'flamingo',
    animalName: 'Flora the Flamingo',
    animalEmoji: '🦩',
    title: 'Flora Lotus Lagoon 🪷',
    subtitle: 'Count 4 pink blooming water lilies!',
    targetCount: 4,
    itemEmoji: '🪷',
    itemLabel: 'Water Lily',
    accentColor: '#DB2777',
    bgLight: '#FCE7F3',
    voicePrompt: 'Welcome to the pink lagoon! Count 4 blooming lotus lilies with Flora!',
    onAnimalSound: () => sounds.playFlamingo(),
  },
  {
    id: 'hippo',
    animalName: 'Hugo the Hippo',
    animalEmoji: '🦛',
    title: 'Hugo Mud Puddle 🫧',
    subtitle: 'Pop 9 fun river mud bubbles with Hugo!',
    targetCount: 9,
    itemEmoji: '🫧',
    itemLabel: 'Mud Bubble',
    accentColor: '#4F46E5',
    bgLight: '#EEF2FF',
    voicePrompt: 'Hugo loves warm mud! Tap and pop all 9 mud bubbles in the pool!',
    onAnimalSound: () => sounds.playHippo(),
  },
  {
    id: 'alligator',
    animalName: 'Alex the Alligator',
    animalEmoji: '🐊',
    title: 'Alex River Crystals 💎',
    subtitle: 'Collect 5 shimmering river gems!',
    targetCount: 5,
    itemEmoji: '💎',
    itemLabel: 'River Gem',
    accentColor: '#047857',
    bgLight: '#D1FAE5',
    voicePrompt: 'Explore the river bottom! Tap 5 sparkling gems hidden by Alex!',
    onAnimalSound: () => sounds.playAlligator(),
  },
  {
    id: 'zebra',
    animalName: 'Ziggy the Zebra',
    animalEmoji: '🦓',
    title: 'Ziggy Savanna Melons 🍉',
    subtitle: 'Count 6 sweet striped watermelons!',
    targetCount: 6,
    itemEmoji: '🍉',
    itemLabel: 'Melon',
    accentColor: '#E11D48',
    bgLight: '#FFE4E6',
    voicePrompt: 'Ziggy found a watermelon patch! Count 6 juicy watermelons in the savanna!',
    onAnimalSound: () => sounds.playZebra(),
  },
  {
    id: 'panda',
    animalName: 'Pip the Panda',
    animalEmoji: '🐼',
    title: 'Pip Bamboo Grove 🎋',
    subtitle: 'Count 8 crunchy green bamboo stalks!',
    targetCount: 8,
    itemEmoji: '🎋',
    itemLabel: 'Bamboo',
    accentColor: '#059669',
    bgLight: '#D1FAE5',
    voicePrompt: 'Panda meal time! Count and feed 8 sweet green bamboo shoots to Pip!',
    onAnimalSound: () => sounds.playPanda(),
  },
  {
    id: 'owl',
    animalName: 'Oliver the Night Owl',
    animalEmoji: '🦉',
    title: 'Oliver Night Fireflies ✨',
    subtitle: 'Catch 7 glowing fireflies in the moonlight!',
    targetCount: 7,
    itemEmoji: '🪲',
    itemLabel: 'Firefly',
    accentColor: '#7C3AED',
    bgLight: '#EDE9FE',
    voicePrompt: 'The jungle is peaceful at night! Tap 7 gentle glowing fireflies with Oliver!',
    onAnimalSound: () => sounds.playOwl(),
  },
  {
    id: 'chameleon',
    animalName: 'Charlie the Chameleon',
    animalEmoji: '🦎',
    title: 'Charlie Rainbow Beetles 🐞',
    subtitle: 'Zap 5 colorful jungle beetles!',
    targetCount: 5,
    itemEmoji: '🐞',
    itemLabel: 'Beetle',
    accentColor: '#C026D3',
    bgLight: '#FAE8FF',
    voicePrompt: 'Charlie is ready with his quick tongue! Count and tap 5 rainbow beetles!',
    onAnimalSound: () => sounds.playChameleon(),
  },
  {
    id: 'rhino',
    animalName: 'Roxy the Rhino',
    animalEmoji: '🦏',
    title: 'Roxy Savanna Sunflowers 🌻',
    subtitle: 'Pick 8 sunny yellow savanna flowers!',
    targetCount: 8,
    itemEmoji: '🌻',
    itemLabel: 'Sunflower',
    accentColor: '#D97706',
    bgLight: '#FEF3C7',
    voicePrompt: 'Roxy loves savanna flowers! Count 8 tall golden sunflowers!',
    onAnimalSound: () => sounds.playRhino(),
  },
  {
    id: 'sloth',
    animalName: 'Sammy the Sloth',
    animalEmoji: '🦥',
    title: 'Sammy Papaya Branch 🥭',
    subtitle: 'Gather 4 sweet ripe papayas for Sammy!',
    targetCount: 4,
    itemEmoji: '🥭',
    itemLabel: 'Papaya',
    accentColor: '#EA580C',
    bgLight: '#FFEDD5',
    voicePrompt: 'Cozy in the tree! Count 4 golden papayas hanging near Sammy!',
    onAnimalSound: () => sounds.playSloth(),
  },
  {
    id: 'lion',
    animalName: 'Leo the Lion Cub',
    animalEmoji: '🦁',
    title: 'Leo Golden Sunrays ☀️',
    subtitle: 'Count 10 radiant sun medallions!',
    targetCount: 10,
    itemEmoji: '☀️',
    itemLabel: 'Sunbeam',
    accentColor: '#D97706',
    bgLight: '#FEF3C7',
    voicePrompt: 'The sun rises over Pride Rock! Count 10 golden sunbeams with Leo!',
    onAnimalSound: () => sounds.playRoar(),
  },
  {
    id: 'toucan',
    animalName: 'Quinn the Toucan',
    animalEmoji: '🦜',
    title: 'Quinn Berry Canopy 🍓',
    subtitle: 'Harvest 9 juicy jungle berries!',
    targetCount: 9,
    itemEmoji: '🍓',
    itemLabel: 'Berry',
    accentColor: '#DC2626',
    bgLight: '#FEE2E2',
    voicePrompt: 'Squawk! Quinn loves sweet jungle berries! Count 9 red berries in the canopy!',
    onAnimalSound: () => sounds.playToucan(),
  },
  {
    id: 'koala',
    animalName: 'Koko the Koala',
    animalEmoji: '🐨',
    title: 'Koko Eucalyptus Treetop 🍃',
    subtitle: 'Count 7 fresh eucalyptus pods!',
    targetCount: 7,
    itemEmoji: '🍃',
    itemLabel: 'Eucalyptus',
    accentColor: '#059669',
    bgLight: '#D1FAE5',
    voicePrompt: 'High in the trees! Count 7 fragrant eucalyptus leaves for Koko!',
    onAnimalSound: () => sounds.playKoala(),
  },
  {
    id: 'whale',
    animalName: 'Wally the Whale',
    animalEmoji: '🐋',
    title: 'Wally Great Water Spouts 🐳',
    subtitle: 'Watch 5 dancing ocean geysers!',
    targetCount: 5,
    itemEmoji: '🐳',
    itemLabel: 'Water Spout',
    accentColor: '#0284C7',
    bgLight: '#E0F2FE',
    voicePrompt: 'Out in the deep blue sea! Count 5 ocean water spouts from Wally!',
    onAnimalSound: () => sounds.playWhale(),
  },
  {
    id: 'yak',
    animalName: 'Yanni the Yak',
    animalEmoji: '🐂',
    title: 'Yanni Alpine Bells 🔔',
    subtitle: 'Ring 6 golden bells on the hillside!',
    targetCount: 6,
    itemEmoji: '🔔',
    itemLabel: 'Golden Bell',
    accentColor: '#B45309',
    bgLight: '#FEF3C7',
    voicePrompt: 'High in the breezy hills! Count and ring 6 golden bells with Yanni!',
    onAnimalSound: () => sounds.playYak(),
  },
  {
    id: 'frog',
    animalName: 'Freddy the Tree Frog',
    animalEmoji: '🐸',
    title: 'Freddy Morning Dewdrops 💧',
    subtitle: 'Count 6 sparkling dewdrops on lilypads!',
    targetCount: 6,
    itemEmoji: '💧',
    itemLabel: 'Dewdrop',
    accentColor: '#16A34A',
    bgLight: '#DCFCE7',
    voicePrompt: 'Ribbit! Count 6 fresh morning dewdrops on Freddy’s green lilypads!',
    onAnimalSound: () => sounds.playSparkle(),
  },
  {
    id: 'cheetah',
    animalName: 'Chase the Cheetah',
    animalEmoji: '🐆',
    title: 'Chase Swift Pawprints 🐾',
    subtitle: 'Follow 8 swift golden tracks!',
    targetCount: 8,
    itemEmoji: '🐾',
    itemLabel: 'Pawprint',
    accentColor: '#D97706',
    bgLight: '#FEF3C7',
    voicePrompt: 'Fast as lightning! Count 8 golden pawprints left by Chase across the plains!',
    onAnimalSound: () => sounds.playRoar(),
  },
  {
    id: 'xray',
    animalName: 'Xavier the X-Ray Fish',
    animalEmoji: '🐠',
    title: 'Xavier Glowing Pearls 🫧',
    subtitle: 'Count 9 translucent sea pearls in the reef!',
    targetCount: 9,
    itemEmoji: '🫧',
    itemLabel: 'Pearl',
    accentColor: '#0EA5E9',
    bgLight: '#E0F2FE',
    voicePrompt: 'Deep in the crystal stream! Count 9 glowing underwater pearls with Xavier!',
    onAnimalSound: () => sounds.playXrayFish(),
  },
  {
    id: 'viper',
    animalName: 'Vicki the Viper',
    animalEmoji: '🐍',
    title: 'Vicki Jungle Orchids 🌺',
    subtitle: 'Count 7 vibrant jungle orchids on the vine!',
    targetCount: 7,
    itemEmoji: '🌺',
    itemLabel: 'Orchid',
    accentColor: '#9333EA',
    bgLight: '#F3E8FF',
    voicePrompt: 'Among the flowering vines! Count 7 fragrant orchids with friendly Vicki!',
    onAnimalSound: () => sounds.playViper(),
  },
  {
    id: 'penguin',
    animalName: 'Penny the Penguin',
    animalEmoji: '🐧',
    title: 'Penny Glacial Ice Gems 🧊',
    subtitle: 'Count 5 sparkling ice cubes with Penny!',
    targetCount: 5,
    itemEmoji: '🧊',
    itemLabel: 'Ice Gem',
    accentColor: '#0284C7',
    bgLight: '#E0F2FE',
    voicePrompt: 'Brrr! Crisp and cool! Count 5 glistening ice cubes with Penny!',
    onAnimalSound: () => sounds.playSparkle(),
  },
];

export const NumberScreen = ({ onAddStars, onTaskCompleted }) => {
  // Mode: 'safari' (24+ animal challenges) | 'missing_number' | 'jungle_math'
  const [activeTabMode, setActiveTabMode] = useState('safari');

  // Active Safari Challenge from the 24-challenge pool
  const [challengeIndex, setChallengeIndex] = useState(0);
  const currentChallenge = NUMBER_SAFARI_CHALLENGES[challengeIndex % NUMBER_SAFARI_CHALLENGES.length];

  // Collected items for active challenge
  const [collectedItems, setCollectedItems] = useState([1, 2, 3, 4]); // 4 initial for Ellie

  // Custom Animal Themed Splash state
  const [showSplash, setShowSplash] = useState(false);
  const [splashData, setSplashData] = useState({
    animalId: 'elephant',
    animalName: 'Ellie the Elephant',
    animalEmoji: '🐘',
    itemEmoji: '💧',
    count: 5,
  });

  // Mode 2: Missing Sequence puzzle
  const [seqIndex, setSeqIndex] = useState(0);
  const [solvedSeq, setSolvedSeq] = useState(false);

  // Mode 3: Visual Jungle Addition puzzle
  const [addIndex, setAddIndex] = useState(0);
  const [solvedAdd, setSolvedAdd] = useState(false);
  const [countedFlowers, setCountedFlowers] = useState([]);

  const { isMuted, toggleMute } = useSoundMute();

  const currentSeq = MISSING_SEQUENCES[seqIndex % MISSING_SEQUENCES.length];
  const currentAdd = ADDITION_PUZZLES[addIndex % ADDITION_PUZZLES.length];

  // Voice helper
  const handleVoicePrompt = () => {
    if (isMuted) {
      toggleMute();
    }
    setTimeout(() => {
      sounds.playTap();
      if (activeTabMode === 'safari') {
        if (currentChallenge.onAnimalSound) currentChallenge.onAnimalSound();
        sounds.speak(currentChallenge.voicePrompt);
      } else if (activeTabMode === 'missing_number') {
        sounds.playSparkle();
        sounds.speak("Find the missing safari stone to cross the jungle river!");
      } else {
        sounds.playSuccess();
        sounds.speak(`Jungle math! Count the flowers: ${currentAdd.a} plus ${currentAdd.b} equals how many?`);
      }
    }, 50);
  };

  // Continuous Shuffling to a new challenge
  const shuffleToNewChallenge = () => {
    sounds.playTap();
    sounds.playSparkle();
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * NUMBER_SAFARI_CHALLENGES.length);
    } while (nextIdx === challengeIndex && NUMBER_SAFARI_CHALLENGES.length > 1);

    setChallengeIndex(nextIdx);
    setCollectedItems([]);
    setShowSplash(false);

    const nextChallenge = NUMBER_SAFARI_CHALLENGES[nextIdx];
    setTimeout(() => {
      if (nextChallenge.onAnimalSound) nextChallenge.onAnimalSound();
      sounds.speak(`New challenge! ${nextChallenge.title}! Count ${nextChallenge.targetCount} ${nextChallenge.itemLabel}s!`);
    }, 200);
  };

  // Sequential Next Challenge
  const handleNextChallenge = () => {
    sounds.playTap();
    const nextIdx = (challengeIndex + 1) % NUMBER_SAFARI_CHALLENGES.length;
    setChallengeIndex(nextIdx);
    setCollectedItems([]);
    setShowSplash(false);

    const nextChallenge = NUMBER_SAFARI_CHALLENGES[nextIdx];
    setTimeout(() => {
      if (nextChallenge.onAnimalSound) nextChallenge.onAnimalSound();
      sounds.speak(`${nextChallenge.title}! Count ${nextChallenge.targetCount} ${nextChallenge.itemLabel}s!`);
    }, 200);
  };

  // Direct Selection of an Animal Challenge
  const selectChallenge = (index) => {
    sounds.playTap();
    setChallengeIndex(index);
    setCollectedItems([]);
    setShowSplash(false);
    setActiveTabMode('safari');

    const nextChallenge = NUMBER_SAFARI_CHALLENGES[index];
    setTimeout(() => {
      if (nextChallenge.onAnimalSound) nextChallenge.onAnimalSound();
      sounds.speak(`${nextChallenge.title}! Count ${nextChallenge.targetCount} ${nextChallenge.itemLabel}s!`);
    }, 200);
  };

  const animalScrollRef = useRef(null);

  useEffect(() => {
    if (animalScrollRef.current && animalScrollRef.current.scrollTo) {
      try {
        const scrollPos = Math.max(0, challengeIndex * 80 - 80);
        animalScrollRef.current.scrollTo({ x: scrollPos, animated: true });
      } catch {}
    }
  }, [challengeIndex]);

  const handleScrollAnimalLeft = () => {
    sounds.playTap();
    const nextIdx = (challengeIndex - 1 + NUMBER_SAFARI_CHALLENGES.length) % NUMBER_SAFARI_CHALLENGES.length;
    selectChallenge(nextIdx);
  };

  const handleScrollAnimalRight = () => {
    sounds.playTap();
    const nextIdx = (challengeIndex + 1) % NUMBER_SAFARI_CHALLENGES.length;
    selectChallenge(nextIdx);
  };

  // --- Tap Interactive Item Handler ---
  const handleItemTap = (num) => {
    sounds.playTap();
    if (collectedItems.includes(num)) {
      sounds.playCountPop(num);
      sounds.speak(`${NUMBER_WORDS[num] || num}!`);
      return;
    }
    const next = [...collectedItems, num].sort((a, b) => a - b);
    setCollectedItems(next);
    sounds.playCountPop(next.length);
    sounds.speak(`${NUMBER_WORDS[next.length] || next.length}! ${currentChallenge.itemLabel} number ${next.length}!`);

    // Check completion
    if (next.length >= currentChallenge.targetCount) {
      setSplashData({
        animalId: currentChallenge.id,
        animalName: currentChallenge.animalName,
        animalEmoji: currentChallenge.animalEmoji,
        itemEmoji: currentChallenge.itemEmoji,
        count: currentChallenge.targetCount,
      });

      if (onAddStars) onAddStars(5);
      if (onTaskCompleted) onTaskCompleted();
      parentalControl.recordNumberStage(currentChallenge.id);

      setTimeout(() => {
        setShowSplash(true);
      }, 350);
    }
  };

  // Tap Next helper button
  const handleAutoFillNext = () => {
    sounds.playTap();
    if (collectedItems.length >= currentChallenge.targetCount) {
      shuffleToNewChallenge();
      return;
    }
    for (let i = 1; i <= currentChallenge.targetCount; i++) {
      if (!collectedItems.includes(i)) {
        handleItemTap(i);
        break;
      }
    }
  };

  // --- Missing Sequence Handlers ---
  const handleMissingOption = (opt) => {
    sounds.playTap();
    if (opt === currentSeq.answer) {
      setSolvedSeq(true);
      sounds.playSuccess();
      sounds.playSparkle();
      sounds.speak(`Brilliant! ${opt} is the missing stone! The safari river path is complete!`);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      if (onAddStars) onAddStars(3);
      if (onTaskCompleted) onTaskCompleted();
      parentalControl.recordNumberStage('missing_sequence');

      setTimeout(() => {
        setSeqIndex((prev) => prev + 1);
        setSolvedSeq(false);
      }, 1800);
    } else {
      sounds.speak(`Not quite ${opt}. Look at the numbers before and after!`);
    }
  };

  // --- Visual Addition Handlers ---
  const handleFlowerTap = (flowerIndex) => {
    sounds.playTap();
    if (!countedFlowers.includes(flowerIndex)) {
      const nextCounted = [...countedFlowers, flowerIndex];
      setCountedFlowers(nextCounted);
      sounds.playCountPop(nextCounted.length);
      sounds.speak(`${nextCounted.length}!`);
    }
  };

  const handleAdditionOption = (opt) => {
    sounds.playTap();
    if (opt === currentAdd.sum) {
      setSolvedAdd(true);
      sounds.playSuccess();
      sounds.playSparkle();
      sounds.speak(`Hooray! ${currentAdd.a} plus ${currentAdd.b} equals ${currentAdd.sum}! You did it!`);

      try {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}

      if (onAddStars) onAddStars(4);
      if (onTaskCompleted) onTaskCompleted();
      parentalControl.recordNumberStage('jungle_addition');

      setTimeout(() => {
        setAddIndex((prev) => prev + 1);
        setSolvedAdd(false);
        setCountedFlowers([]);
      }, 2000);
    } else {
      sounds.speak(`Count the flowers together! Try again!`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Banner */}
      <View style={styles.viewBannerCard}>
        <View style={styles.viewBannerDecorCircle1} />
        <View style={styles.viewBannerDecorCircle2} />

        <View style={styles.viewBannerHeaderRow}>
          <View style={styles.viewTagRow}>
            <View style={[styles.viewBadge, { backgroundColor: currentChallenge.accentColor }]}>
              <Hash size={22} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.viewTextColumn}>
              <Text style={styles.viewCategoryTag}>NUMBER SAFARI • 24+ CHALLENGES</Text>
              <Text style={styles.viewMainTitle}>
                {activeTabMode === 'safari' && currentChallenge.title}
                {activeTabMode === 'missing_number' && 'Missing Safari Stone 🔍'}
                {activeTabMode === 'jungle_math' && 'Jungle Math Bloom 🌺'}
              </Text>
            </View>
          </View>

          {/* Voice Prompt Helper Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            activeOpacity={0.85}
            onPress={handleVoicePrompt}
            accessibilityLabel="Audio instruction helper"
          >
            <Text style={styles.voiceIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Top Category Tabs */}
        <View style={styles.modeTabsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              sounds.playTap();
              setActiveTabMode('safari');
            }}
            style={[styles.modeTab, activeTabMode === 'safari' && styles.modeTabActiveSafari]}
          >
            <Text style={styles.modeTabEmoji}>🦁</Text>
            <Text style={[styles.modeTabText, activeTabMode === 'safari' && styles.modeTabTextActive]}>
              Animal Safari (24+)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              sounds.playTap();
              setActiveTabMode('missing_number');
            }}
            style={[styles.modeTab, activeTabMode === 'missing_number' && styles.modeTabActiveSeq]}
          >
            <Text style={styles.modeTabEmoji}>🔍</Text>
            <Text style={[styles.modeTabText, activeTabMode === 'missing_number' && styles.modeTabTextActive]}>
              Missing Stone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              sounds.playTap();
              setActiveTabMode('jungle_math');
            }}
            style={[styles.modeTab, activeTabMode === 'jungle_math' && styles.modeTabActiveMath]}
          >
            <Text style={styles.modeTabEmoji}>🌺</Text>
            <Text style={[styles.modeTabText, activeTabMode === 'jungle_math' && styles.modeTabTextActive]}>
              Jungle Math
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =========================================================================
          MODE 1: 24+ ANIMAL NUMBER SAFARI CHALLENGES WITH CONTINUOUS SHUFFLING
          ========================================================================= */}
      {activeTabMode === 'safari' && (
        <View style={styles.challengeSection}>
          {/* Quick Shuffle & Next Action Header */}
          <View style={styles.shuffleHeaderCard}>
            <View style={styles.shuffleInfoCol}>
              <Text style={styles.shuffleTag}>CHALLENGE #{challengeIndex + 1} OF 24</Text>
              <Text style={styles.shuffleSub}>{currentChallenge.animalName}</Text>
            </View>

            <View style={styles.shuffleBtnsRow}>
              <TouchableOpacity
                style={styles.shuffleButton}
                activeOpacity={0.8}
                onPress={shuffleToNewChallenge}
              >
                <Shuffle size={16} color="#FFFFFF" />
                <Text style={styles.shuffleBtnText}>Shuffle 🎲</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextChallengeBtn}
                activeOpacity={0.8}
                onPress={handleNextChallenge}
              >
                <ArrowRight size={16} color="#0F172A" />
                <Text style={styles.nextChallengeBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 24-Animal Quick Selector Carousel with Arrow Buttons */}
          <View style={styles.carouselRowContainer}>
            <TouchableOpacity
              style={styles.carouselArrowBtn}
              activeOpacity={0.75}
              onPress={handleScrollAnimalLeft}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 6 }}
              accessibilityLabel="Previous animal"
            >
              <Text style={styles.carouselArrowText}>◀</Text>
            </TouchableOpacity>

            <ScrollView
              ref={animalScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.carouselScrollView}
              contentContainerStyle={styles.animalCarouselScroll}
            >
              {NUMBER_SAFARI_CHALLENGES.map((ch, idx) => {
                const isCurrent = idx === challengeIndex;
                return (
                  <TouchableOpacity
                    key={ch.id}
                    activeOpacity={0.8}
                    onPress={() => selectChallenge(idx)}
                    style={[
                      styles.animalPill,
                      isCurrent && { backgroundColor: ch.accentColor, borderColor: ch.accentColor },
                    ]}
                  >
                    <Text style={styles.animalPillEmoji}>{ch.animalEmoji}</Text>
                    <Text style={[styles.animalPillText, isCurrent && styles.animalPillTextActive]}>
                      {ch.itemEmoji} {ch.targetCount}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.carouselArrowBtn}
              activeOpacity={0.75}
              onPress={handleScrollAnimalRight}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
              accessibilityLabel="Next animal"
            >
              <Text style={styles.carouselArrowText}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Speech Prompt Banner */}
          <View style={[styles.promptBanner, { borderLeftColor: currentChallenge.accentColor, borderLeftWidth: 4 }]}>
            <TouchableOpacity
              onPress={() => {
                if (currentChallenge.onAnimalSound) currentChallenge.onAnimalSound();
              }}
              style={styles.chatIconCircle}
            >
              <Text style={styles.chatEmoji}>{currentChallenge.animalEmoji}</Text>
            </TouchableOpacity>
            <Text style={styles.promptText}>
              <Text style={[styles.promptHighlight, { color: currentChallenge.accentColor }]}>
                "{currentChallenge.animalName}: "
              </Text>
              {currentChallenge.subtitle}
            </Text>
          </View>

          {/* Dynamic Interactive Canopy Scene */}
          <View style={[styles.sceneContainer, { backgroundColor: currentChallenge.bgLight }]}>
            {/* Hanging / Floating Item Bubbles (1 to Target Count) */}
            <View style={styles.dynamicItemsGrid}>
              {Array.from({ length: currentChallenge.targetCount }).map((_, i) => {
                const num = i + 1;
                const isCollected = collectedItems.includes(num);
                return (
                  <TouchableOpacity
                    key={num}
                    activeOpacity={0.8}
                    onPress={() => handleItemTap(num)}
                    style={[
                      styles.dynamicItemBubble,
                      isCollected
                        ? [styles.itemBubbleCollected, { borderColor: currentChallenge.accentColor, backgroundColor: '#FFFFFF' }]
                        : styles.itemBubblePending,
                    ]}
                  >
                    <Text style={styles.dynamicItemEmoji}>{currentChallenge.itemEmoji}</Text>
                    <View
                      style={[
                        styles.itemNumBadge,
                        isCollected
                          ? { backgroundColor: currentChallenge.accentColor }
                          : { backgroundColor: '#94A3B8' },
                      ]}
                    >
                      <Text style={styles.itemNumText}>{num}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Character & Collection Basket */}
            <View style={styles.sceneBottomRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  if (currentChallenge.onAnimalSound) currentChallenge.onAnimalSound();
                  sounds.speak(
                    collectedItems.length >= currentChallenge.targetCount
                      ? `Hooray! ${currentChallenge.animalName} completed all ${currentChallenge.targetCount} ${currentChallenge.itemLabel}s!`
                      : `Keep counting! ${collectedItems.length} of ${currentChallenge.targetCount} collected!`
                  );
                }}
                style={styles.companionWrapper}
              >
                {currentChallenge.image ? (
                  <Image source={{ uri: currentChallenge.image }} style={styles.companionImg} resizeMode="cover" />
                ) : (
                  <View style={[styles.companionHalo, { backgroundColor: '#FFFFFF', borderColor: currentChallenge.accentColor }]}>
                    <Text style={styles.companionBigEmoji}>{currentChallenge.animalEmoji}</Text>
                  </View>
                )}
                <View style={[styles.companionBadge, { backgroundColor: currentChallenge.accentColor }]}>
                  <Text style={styles.companionBadgeText}>{currentChallenge.animalName} (Tap!)</Text>
                </View>
              </TouchableOpacity>

              {/* Basket / Storage Tray with Real-Time Counter */}
              <View style={styles.collectionBasket}>
                <View style={styles.basketItemsWrap}>
                  {Array.from({ length: currentChallenge.targetCount }).map((_, i) => {
                    const slot = i + 1;
                    const hasItem = collectedItems.includes(slot);
                    return (
                      <View key={slot} style={styles.basketSlotMini}>
                        <Text style={[styles.basketEmojiMini, !hasItem && styles.basketEmojiHidden]}>
                          {currentChallenge.itemEmoji}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <View style={[styles.basketCounterBadge, { backgroundColor: currentChallenge.accentColor }]}>
                  <Text style={styles.basketCounterEmoji}>⭐</Text>
                  <Text style={styles.basketCounterText}>
                    {collectedItems.length} / {currentChallenge.targetCount} {currentChallenge.itemLabel}s {collectedItems.length >= currentChallenge.targetCount ? '🎉' : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Wooden Tray Slots Grid */}
          <View style={styles.woodenTrayCard}>
            <View style={styles.trayHeader}>
              <Text style={styles.trayTitle}>{currentChallenge.animalName}'s Counting Tray</Text>
              <View
                style={[
                  styles.trayBadge,
                  collectedItems.length >= currentChallenge.targetCount && styles.trayBadgeDone,
                ]}
              >
                <Text style={styles.trayBadgeText}>
                  {collectedItems.length} of {currentChallenge.targetCount} Collected
                </Text>
              </View>
            </View>

            <View style={styles.traySlotsGrid}>
              {Array.from({ length: currentChallenge.targetCount }).map((_, i) => {
                const num = i + 1;
                const hasItem = collectedItems.includes(num);
                return (
                  <TouchableOpacity
                    key={num}
                    activeOpacity={0.8}
                    onPress={() => handleItemTap(num)}
                    style={[
                      styles.traySlot,
                      !hasItem && styles.traySlotEmpty,
                      hasItem && { borderColor: currentChallenge.accentColor, backgroundColor: '#FFFFFF' },
                    ]}
                  >
                    {hasItem ? (
                      <>
                        <Text style={styles.trayBananaEmoji}>{currentChallenge.itemEmoji}</Text>
                        <Text style={[styles.trayNumberText, { color: currentChallenge.accentColor }]}>{num}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.trayQuestionMark}>❓</Text>
                        <Text style={styles.trayNumberTextPending}>{num}?</Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Main Action / Auto-fill Button */}
          <SquishyButton
            variant={collectedItems.length >= currentChallenge.targetCount ? 'secondary' : 'primary'}
            size="lg"
            onPress={handleAutoFillNext}
            style={styles.mainFeedBtn}
            icon={<Text style={styles.btnIcon}>{collectedItems.length >= currentChallenge.targetCount ? '🎲' : currentChallenge.itemEmoji}</Text>}
          >
            {collectedItems.length >= currentChallenge.targetCount
              ? 'Completed! Shuffle Next Challenge 🎲'
              : `Tap Item #${collectedItems.length + 1} with ${currentChallenge.animalName}!`}
          </SquishyButton>
        </View>
      )}

      {/* =========================================================================
          MODE 2: MISSING SAFARI STONE PUZZLE
          ========================================================================= */}
      {activeTabMode === 'missing_number' && (
        <View style={styles.challengeSection}>
          <View style={styles.promptBanner}>
            <View style={styles.chatIconCircle}>
              <Text style={styles.chatEmoji}>🔍</Text>
            </View>
            <Text style={styles.promptText}>
              <Text style={styles.promptHighlight}>"A stone washed away in the river! </Text>
              Which number completes the stepping stones?"
            </Text>
          </View>

          <View style={styles.steppingStonesCard}>
            <Text style={styles.steppingStonesTitle}>RIVER STEPPING STONES</Text>
            <View style={styles.stonesRow}>
              {currentSeq.sequence.map((val, idx) => {
                const isMissing = idx === currentSeq.missingIndex;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.stoneItem,
                      isMissing && styles.stoneItemMissing,
                      isMissing && solvedSeq && styles.stoneItemSolved,
                    ]}
                  >
                    {isMissing ? (
                      <Text style={[styles.stoneTextMissing, solvedSeq && styles.stoneTextSolved]}>
                        {solvedSeq ? currentSeq.answer : '?'}
                      </Text>
                    ) : (
                      <Text style={styles.stoneText}>{val}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.optionsSection}>
            <Text style={styles.optionsPrompt}>Tap the missing stone to fix the bridge:</Text>
            <View style={styles.optionsRow}>
              {currentSeq.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => handleMissingOption(opt)}
                  style={[
                    styles.optionStoneBtn,
                    solvedSeq && opt === currentSeq.answer && styles.optionStoneBtnCorrect,
                  ]}
                >
                  <Text style={styles.optionStoneText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* =========================================================================
          MODE 3: JUNGLE VISUAL ADDITION
          ========================================================================= */}
      {activeTabMode === 'jungle_math' && (
        <View style={styles.challengeSection}>
          <View style={styles.promptBanner}>
            <View style={styles.chatIconCircle}>
              <Text style={styles.chatEmoji}>🌺</Text>
            </View>
            <Text style={styles.promptText}>
              <Text style={styles.promptHighlight}>"Count the flowers on each lilypad! </Text>
              How many flowers are there in total?"
            </Text>
          </View>

          <View style={styles.additionGardenCard}>
            <View style={styles.additionRow}>
              <View style={styles.flowerGroup}>
                <View style={styles.flowersGrid}>
                  {Array.from({ length: currentAdd.a }).map((_, i) => (
                    <TouchableOpacity
                      key={`a-${i}`}
                      activeOpacity={0.8}
                      onPress={() => handleFlowerTap(i)}
                      style={[
                        styles.flowerItem,
                        countedFlowers.includes(i) && styles.flowerItemCounted,
                      ]}
                    >
                      <Text style={styles.flowerEmoji}>{currentAdd.emojiA}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.groupCountBadge}>
                  <Text style={styles.groupCountText}>{currentAdd.a}</Text>
                </View>
              </View>

              <Text style={styles.mathSign}>+</Text>

              <View style={styles.flowerGroup}>
                <View style={styles.flowersGrid}>
                  {Array.from({ length: currentAdd.b }).map((_, i) => {
                    const globalIdx = currentAdd.a + i;
                    return (
                      <TouchableOpacity
                        key={`b-${i}`}
                        activeOpacity={0.8}
                        onPress={() => handleFlowerTap(globalIdx)}
                        style={[
                          styles.flowerItem,
                          countedFlowers.includes(globalIdx) && styles.flowerItemCounted,
                        ]}
                      >
                        <Text style={styles.flowerEmoji}>{currentAdd.emojiB}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.groupCountBadge}>
                  <Text style={styles.groupCountText}>{currentAdd.b}</Text>
                </View>
              </View>

              <Text style={styles.mathSign}>=</Text>

              <View style={[styles.mathMysteryBox, solvedAdd && styles.mathMysteryBoxSolved]}>
                <Text style={styles.mathMysteryText}>{solvedAdd ? currentAdd.sum : '?'}</Text>
              </View>
            </View>

            <Text style={styles.chooseTotalPrompt}>Choose the total number of flowers:</Text>
            <View style={styles.lilyPadsRow}>
              {currentAdd.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => handleAdditionOption(opt)}
                  style={[
                    styles.lilyPadBtn,
                    solvedAdd && opt === currentAdd.sum && styles.lilyPadBtnCorrect,
                  ]}
                >
                  <Text style={styles.lilyPadLeaf}>🪷</Text>
                  <Text style={styles.lilyPadNum}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* DEDICATED ANIMAL THEMED COMPLETION SPLASH OVERLAY */}
      <AnimalSplashOverlay
        visible={showSplash}
        animalId={splashData.animalId}
        animalName={splashData.animalName}
        animalEmoji={splashData.animalEmoji}
        itemEmoji={splashData.itemEmoji}
        count={splashData.count}
        onNext={() => {
          setShowSplash(false);
          shuffleToNewChallenge();
        }}
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
    gap: 12,
    maxWidth: 480,
    width: '100%',
    marginHorizontal: 'auto',
  },
  carouselRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  carouselArrowBtn: {
    width: 28,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 2,
  },
  carouselArrowText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '900',
  },
  carouselScrollView: {
    flex: 1,
  },
  viewBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    gap: 10,
  },
  viewBannerDecorCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    opacity: 0.5,
  },
  viewBannerDecorCircle2: {
    position: 'absolute',
    bottom: -15,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    opacity: 0.4,
  },
  viewBannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  viewBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  viewTextColumn: {
    flex: 1,
  },
  viewCategoryTag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  viewMainTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 17,
    fontWeight: '900',
    color: colors.onSurface,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    cursor: 'pointer',
  },
  voiceIcon: {
    fontSize: 18,
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderRadius: borderRadius.md,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
  },
  modeTabActiveSafari: {
    backgroundColor: '#0284C7',
  },
  modeTabActiveSeq: {
    backgroundColor: '#D97706',
  },
  modeTabActiveMath: {
    backgroundColor: '#DB2777',
  },
  modeTabEmoji: {
    fontSize: 13,
  },
  modeTabText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  challengeSection: {
    gap: 12,
  },
  shuffleHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  shuffleInfoCol: {
    flex: 1,
  },
  shuffleTag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  shuffleSub: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 14,
    fontWeight: '900',
    color: colors.onSurface,
  },
  shuffleBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    cursor: 'pointer',
  },
  shuffleBtnText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  nextChallengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    cursor: 'pointer',
  },
  nextChallengeBtnText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  animalCarouselScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  animalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
  },
  animalPillEmoji: {
    fontSize: 14,
  },
  animalPillText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  animalPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  promptBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chatIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatEmoji: {
    fontSize: 20,
  },
  promptText: {
    flex: 1,
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 18,
  },
  promptHighlight: {
    fontWeight: '900',
  },
  sceneContainer: {
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  dynamicItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  dynamicItemBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    cursor: 'pointer',
  },
  itemBubblePending: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  itemBubbleCollected: {
    transform: [{ scale: 1.05 }],
  },
  dynamicItemEmoji: {
    fontSize: 26,
  },
  itemNumBadge: {
    position: 'absolute',
    bottom: -4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  itemNumText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sceneBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  companionWrapper: {
    alignItems: 'center',
    cursor: 'pointer',
  },
  companionImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  companionHalo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionBigEmoji: {
    fontSize: 38,
  },
  companionBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  companionBadgeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  collectionBasket: {
    flex: 1,
    gap: 6,
  },
  basketItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    minHeight: 34,
    alignItems: 'center',
  },
  basketSlotMini: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketEmojiMini: {
    fontSize: 14,
  },
  basketEmojiHidden: {
    opacity: 0,
  },
  basketCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  basketCounterEmoji: {
    fontSize: 12,
  },
  basketCounterText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  woodenTrayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  trayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trayTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: colors.onSurface,
  },
  trayBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  trayBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  trayBadgeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  traySlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  traySlot: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    cursor: 'pointer',
  },
  traySlotEmpty: {
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  trayBananaEmoji: {
    fontSize: 16,
  },
  trayNumberText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '900',
  },
  trayQuestionMark: {
    fontSize: 12,
    opacity: 0.6,
  },
  trayNumberTextPending: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
  },
  mainFeedBtn: {
    marginTop: 2,
  },
  btnIcon: {
    fontSize: 18,
  },
  steppingStonesCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: borderRadius.md,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  steppingStonesTitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 0.8,
  },
  stonesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stoneItem: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stoneItemMissing: {
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    backgroundColor: '#FEF3C7',
  },
  stoneItemSolved: {
    borderColor: '#10B981',
    borderStyle: 'solid',
    backgroundColor: '#D1FAE5',
  },
  stoneText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 20,
    fontWeight: '900',
    color: '#0284C7',
  },
  stoneTextMissing: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 20,
    fontWeight: '900',
    color: '#D97706',
  },
  stoneTextSolved: {
    color: '#059669',
  },
  optionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionsPrompt: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  optionStoneBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    cursor: 'pointer',
  },
  optionStoneBtnCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    transform: [{ scale: 1.1 }],
  },
  optionStoneText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    color: '#0284C7',
  },
  additionGardenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  additionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flowerGroup: {
    alignItems: 'center',
    gap: 6,
  },
  flowersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 68,
    gap: 4,
    justifyContent: 'center',
  },
  flowerItem: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  flowerItemCounted: {
    backgroundColor: '#FCE7F3',
    borderWidth: 1.5,
    borderColor: '#DB2777',
    transform: [{ scale: 1.08 }],
  },
  flowerEmoji: {
    fontSize: 16,
  },
  groupCountBadge: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  groupCountText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: '#DB2777',
  },
  mathSign: {
    fontSize: 22,
    fontWeight: '900',
    color: '#64748B',
  },
  mathMysteryBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#DB2777',
    borderStyle: 'dashed',
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mathMysteryBoxSolved: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderStyle: 'solid',
  },
  mathMysteryText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    color: '#DB2777',
  },
  chooseTotalPrompt: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  lilyPadsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lilyPadBtn: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FDF2F8',
    borderWidth: 2,
    borderColor: '#F472B6',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  lilyPadBtnCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    transform: [{ scale: 1.08 }],
  },
  lilyPadLeaf: {
    fontSize: 16,
  },
  lilyPadNum: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#DB2777',
  },
});
