import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { BookA } from 'lucide-react';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';
import { SquishyButton } from '../components/SquishyButton';
import { LetterTracer } from '../components/LetterTracer';

// High-resolution bespoke 3D clay animal illustrations for every alphabet A through Z
import alligatorAlexImg from '../assets/images/alligator_alex.jpg';
import bearBarnabyImg from '../assets/images/bear_barnaby.jpg';
import chameleonCharlieImg from '../assets/images/chameleon_charlie.jpg';
import dolphinDannyImg from '../assets/images/dolphin_danny.jpg';
import elephantOasisImg from '../assets/images/elephant_oasis.png';
import flamingoFloraImg from '../assets/images/flamingo_flora.jpg';
import giraffeGigiImg from '../assets/images/giraffe_gigi.jpg';
import hippoHugoImg from '../assets/images/hippo_hugo.jpg';
import iguanaIggyImg from '../assets/images/iguana_iggy.jpg';
import jaguarCubImg from '../assets/images/jaguar_cub.jpg';
import koalaTreetopImg from '../assets/images/koala_treetop.jpg';
import lionCubImg from '../assets/images/lion_cub.png';
import monkeyForestImg from '../assets/images/monkey_forest.png';
import nestNuthatchImg from '../assets/images/nest_nuthatch.jpg';
import owlNightImg from '../assets/images/owl_night.jpg';
import pandaPipImg from '../assets/images/panda_pip.svg';
import quailQuinnImg from '../assets/images/quail_quinn.svg';
import rhinoRoxyImg from '../assets/images/rhino_roxy.jpg';
import slothSammyImg from '../assets/images/sloth_sammy.jpg';
import toucanIslandImg from '../assets/images/toucan_island.png';
import umbrellaBirdUmaImg from '../assets/images/umbrella_bird_uma.jpg';
import viperVickiImg from '../assets/images/viper_vicki.jpg';
import whaleWallyImg from '../assets/images/whale_wally.jpg';
import xrayFishXavierImg from '../assets/images/xray_fish_xavier.jpg';
import yakYanniImg from '../assets/images/yak_yanni.jpg';
import zebraZiggyImg from '../assets/images/zebra_ziggy.jpg';

// Comprehensive 26-letter dictionary: Every letter has a unique animal, phonics, words, strokes & view
// Comprehensive 26-letter dictionary: Every letter has a unique animal, clean natural phonics, words, strokes & view
const LETTER_DATABASE = {
  A: {
    letter: 'A',
    name: 'Alex the Alligator',
    phonics: 'A is for Apple!',
    audioPrompt: 'A is for Apple! Alex the Alligator smiling with sweet red apples in the sunlit river!',
    emoji: '🐊',
    image: alligatorAlexImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#006C49',
    habitat: 'Sunlit Riverbank',
    words: [
      { word: 'Apple', phonetic: 'Ap • ple', emoji: '🍎', prompt: 'Apple! Sweet crisp red apple!' },
      { word: 'Alligator', phonetic: 'Al • li • ga • tor', emoji: '🐊', prompt: 'Alligator! Smiling in the water!', sound: 'alligator' },
      { word: 'Ant', phonetic: 'Ant', emoji: '🐜', prompt: 'Ant! Tiny busy jungle ant!' },
    ],
  },
  B: {
    letter: 'B',
    name: 'Barnaby the Bear',
    phonics: 'B is for Bear!',
    audioPrompt: 'B is for Bear! Barnaby the Bear enjoying sweet blueberries in the forest!',
    emoji: '🐻',
    image: bearBarnabyImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#7D5800',
    habitat: 'Berry Forest Clearing',
    words: [
      { word: 'Bear', phonetic: 'Bear', emoji: '🐻', prompt: 'Bear! Fuzzy friendly bear cub!', sound: 'bear' },
      { word: 'Banana', phonetic: 'Ba • na • na', emoji: '🍌', prompt: 'Banana! Sweet yellow snack!' },
      { word: 'Butterfly', phonetic: 'But • ter • fly', emoji: '🦋', prompt: 'Butterfly! Flapping colorful wings!' },
    ],
  },
  C: {
    letter: 'C',
    name: 'Charlie the Chameleon',
    phonics: 'C is for Chameleon!',
    audioPrompt: 'C is for Chameleon! Charlie changes rainbow colors on the vine!',
    emoji: '🦎',
    image: chameleonCharlieImg,
    strokes: 1,
    strokeTitle: '1 Open Curve',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#10B981',
    habitat: 'Tropical Flower Vines',
    words: [
      { word: 'Chameleon', phonetic: 'Cha • me • le • on', emoji: '🦎', prompt: 'Chameleon! Blending into the jungle leaves!' },
      { word: 'Coconut', phonetic: 'Co • co • nut', emoji: '🥥', prompt: 'Coconut! High up in the tall palm!' },
      { word: 'Caterpillar', phonetic: 'Cat • er • pil • lar', emoji: '🐛', prompt: 'Caterpillar! Wiggling on the twig!' },
    ],
  },
  D: {
    letter: 'D',
    name: 'Danny the Dolphin',
    phonics: 'D is for Dolphin!',
    audioPrompt: 'D is for Dolphin! Danny the Dolphin leaping in the turquoise waves!',
    emoji: '🐬',
    image: dolphinDannyImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#00668A',
    habitat: 'Turquoise Coral Cove',
    words: [
      { word: 'Dolphin', phonetic: 'Dol • phin', emoji: '🐬', prompt: 'Dolphin! Leaping in the ocean waves!', sound: 'dolphin' },
      { word: 'Drum', phonetic: 'Drum', emoji: '🥁', prompt: 'Drum! Boom boom rhythm!' },
      { word: 'Duck', phonetic: 'Duck', emoji: '🦆', prompt: 'Duck! Quack quack in the pond!' },
    ],
  },
  E: {
    letter: 'E',
    name: 'Ellie the Elephant',
    phonics: 'E is for Elephant!',
    audioPrompt: 'E is for Elephant! Ellie the Elephant splashing with her big trunk at the oasis!',
    emoji: '🐘',
    image: elephantOasisImg,
    strokes: 4,
    strokeTitle: '4 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#00668A',
    habitat: 'Sparkling River Oasis',
    words: [
      { word: 'Elephant', phonetic: 'El • e • phant', emoji: '🐘', prompt: 'Elephant! Gentle giant!', sound: 'elephant' },
      { word: 'Egg', phonetic: 'Egg', emoji: '🥚', prompt: 'Egg! Cozy in the warm nest!' },
      { word: 'Echo', phonetic: 'Ech • o', emoji: '📢', prompt: 'Echo! Calling through the trees!' },
    ],
  },
  F: {
    letter: 'F',
    name: 'Flora the Flamingo',
    phonics: 'F is for Flamingo!',
    audioPrompt: 'F is for Flamingo! Flora standing tall and pink in the lagoon!',
    emoji: '🦩',
    image: flamingoFloraImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#BE185D',
    habitat: 'Pink Lotus Lagoon',
    words: [
      { word: 'Flamingo', phonetic: 'Fla • min • go', emoji: '🦩', prompt: 'Flamingo! Bright pink feathers!' },
      { word: 'Frog', phonetic: 'Frog', emoji: '🐸', prompt: 'Frog! Ribbit on the green lily pad!' },
      { word: 'Flower', phonetic: 'Flow • er', emoji: '🌺', prompt: 'Flower! Sweet fragrant jungle bloom!' },
    ],
  },
  G: {
    letter: 'G',
    name: 'Gigi the Giraffe',
    phonics: 'G is for Giraffe!',
    audioPrompt: 'G is for Giraffe! Gigi reaching the high golden treetops!',
    emoji: '🦒',
    image: giraffeGigiImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#B45309',
    habitat: 'Sunlit Acacia Plains',
    words: [
      { word: 'Giraffe', phonetic: 'Gi • raffe', emoji: '🦒', prompt: 'Giraffe! Nibbling leaves up high!' },
      { word: 'Gorilla', phonetic: 'Go • ril • la', emoji: '🦍', prompt: 'Gorilla! Gentle forest friend!' },
      { word: 'Grapes', phonetic: 'Grapes', emoji: '🍇', prompt: 'Grapes! Sweet purple bunch!' },
    ],
  },
  H: {
    letter: 'H',
    name: 'Hugo the Hippo',
    phonics: 'H is for Hippo!',
    audioPrompt: 'H is for Hippo! Hugo splashing happily in the river pool!',
    emoji: '🦛',
    image: hippoHugoImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#0F766E',
    habitat: 'Muddy Oasis Spring',
    words: [
      { word: 'Hippo', phonetic: 'Hip • po', emoji: '🦛', prompt: 'Hippo! Keeping cool in the water!' },
      { word: 'Honey', phonetic: 'Hon • ey', emoji: '🍯', prompt: 'Honey! Sweet golden jungle honey!' },
      { word: 'Hut', phonetic: 'Hut', emoji: '🛖', prompt: 'Hut! Cozy shelter under palm trees!' },
    ],
  },
  I: {
    letter: 'I',
    name: 'Iggy the Iguana',
    phonics: 'I is for Iguana!',
    audioPrompt: 'I is for Iguana! Iggy basking on warm sunny jungle rocks!',
    emoji: '🦎',
    image: iguanaIggyImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#047857',
    habitat: 'Warm Canopy Sunrock',
    words: [
      { word: 'Iguana', phonetic: 'I • gua • na', emoji: '🦎', prompt: 'Iguana! Spiky green tail in the sun!' },
      { word: 'Island', phonetic: 'Is • land', emoji: '🏝️', prompt: 'Island! Surrounded by sparkling blue!' },
      { word: 'Insect', phonetic: 'In • sect', emoji: '🐞', prompt: 'Insect! Little spotted ladybug!' },
    ],
  },
  J: {
    letter: 'J',
    name: 'Jaguar Jack',
    phonics: 'J is for Jaguar!',
    audioPrompt: 'J is for Jaguar! Jaguar Jack fast and nimble in the jungle trees!',
    emoji: '🐆',
    image: jaguarCubImg,
    strokes: 1,
    strokeTitle: '1 Hook Stroke',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#D97706',
    habitat: 'Mossy Rainforest Bough',
    words: [
      { word: 'Jaguar', phonetic: 'Jag • uar', emoji: '🐆', prompt: 'Jaguar! Beautiful golden spots!' },
      { word: 'Juice', phonetic: 'Juice', emoji: '🧃', prompt: 'Juice! Sweet tropical fruit juice!' },
      { word: 'Jungle', phonetic: 'Jun • gle', emoji: '🌴', prompt: 'Jungle! Full of tall green trees!' },
    ],
  },
  K: {
    letter: 'K',
    name: 'Koala Kip',
    phonics: 'K is for Koala!',
    audioPrompt: 'K is for Koala! Koala Kip cozy high up in the leafy branches!',
    emoji: '🐨',
    image: koalaTreetopImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#4B5563',
    habitat: 'Eucalyptus Treetop',
    words: [
      { word: 'Koala', phonetic: 'Ko • a • la', emoji: '🐨', prompt: 'Koala! Fluffy round ears!' },
      { word: 'Kangaroo', phonetic: 'Kan • ga • roo', emoji: '🦘', prompt: 'Kangaroo! Hop hop hop!' },
      { word: 'Kite', phonetic: 'Kite', emoji: '🪁', prompt: 'Kite! Flying in the sky!' },
    ],
  },
  L: {
    letter: 'L',
    name: 'Lion Cub Leo',
    phonics: 'L is for Lion!',
    audioPrompt: 'L is for Lion! Leo the Lion Cub with a mighty roaring heart!',
    emoji: '🦁',
    image: lionCubImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#D97706',
    habitat: 'Golden Sunlit Clearing',
    words: [
      { word: 'Lion', phonetic: 'Li • on', emoji: '🦁', prompt: 'Lion! King of the jungle! Roar!', sound: 'roar' },
      { word: 'Leaf', phonetic: 'Leaf', emoji: '🍃', prompt: 'Leaf! Green jungle leaf!' },
      { word: 'Lemon', phonetic: 'Lem • on', emoji: '🍋', prompt: 'Lemon! Bright yellow citrus!' },
    ],
  },
  M: {
    letter: 'M',
    name: 'Milo the Monkey',
    phonics: 'M is for Monkey!',
    audioPrompt: 'M is for Monkey! Milo the Monkey swinging through the emerald trees!',
    emoji: '🐒',
    image: monkeyForestImg,
    strokes: 4,
    strokeTitle: '4 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#7D5800',
    habitat: 'Emerald Canopy Forest',
    words: [
      { word: 'Monkey', phonetic: 'Mon • key', emoji: '🐒', prompt: 'Monkey! Loves bananas! Ooh ooh aah aah!', sound: 'monkey' },
      { word: 'Mango', phonetic: 'Man • go', emoji: '🥭', prompt: 'Mango! Sweet juicy jungle fruit!' },
      { word: 'Moon', phonetic: 'Moon', emoji: '🌙', prompt: 'Moon! Glowing in the night sky!' },
    ],
  },
  N: {
    letter: 'N',
    name: 'Nala the Nuthatch',
    phonics: 'N is for Nest!',
    audioPrompt: 'N is for Nest! Nala building a cozy nest safe in the treetops!',
    emoji: '🪺',
    image: nestNuthatchImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#006C49',
    habitat: 'Cozy Tree Canopy Nest',
    words: [
      { word: 'Nest', phonetic: 'Nest', emoji: '🪺', prompt: 'Nest! Cozy home for baby birds!' },
      { word: 'Nut', phonetic: 'Nut', emoji: '🥜', prompt: 'Nut! Crunchy snack for squirrels!' },
      { word: 'Night', phonetic: 'Night', emoji: '🌌', prompt: 'Night! Sparkling stars are glowing!' },
    ],
  },
  O: {
    letter: 'O',
    name: 'Ollie the Owl',
    phonics: 'O is for Owl!',
    audioPrompt: 'O is for Owl! Ollie the Owl watching with big wise eyes in the starry night!',
    emoji: '🦉',
    image: owlNightImg,
    strokes: 1,
    strokeTitle: '1 Round Loop',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#1E1B4B',
    habitat: 'Twilight Hollow Tree',
    words: [
      { word: 'Owl', phonetic: 'Owl', emoji: '🦉', prompt: 'Owl! Hoo hoo in the night!' },
      { word: 'Orange', phonetic: 'Or • ange', emoji: '🍊', prompt: 'Orange! Juicy round fruit!' },
      { word: 'Octopus', phonetic: 'Oc • to • pus', emoji: '🐙', prompt: 'Octopus! Eight friendly wiggly arms!' },
    ],
  },
  P: {
    letter: 'P',
    name: 'Pip the Panda',
    phonics: 'P is for Panda!',
    audioPrompt: 'P is for Panda! Pip the Panda happily munching sweet green bamboo!',
    emoji: '🐼',
    image: pandaPipImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#065F46',
    habitat: 'Misty Bamboo Valley',
    words: [
      { word: 'Panda', phonetic: 'Pan • da', emoji: '🐼', prompt: 'Panda! Cute black and white cub!' },
      { word: 'Parrot', phonetic: 'Par • rot', emoji: '🦜', prompt: 'Parrot! Bright colorful feathers!' },
      { word: 'Pineapple', phonetic: 'Pine • ap • ple', emoji: '🍍', prompt: 'Pineapple! Sweet tropical fruit!' },
    ],
  },
  Q: {
    letter: 'Q',
    name: 'Quinn the Quail',
    phonics: 'Q is for Quail!',
    audioPrompt: 'Q is for Quail! Quinn the Quail running cheerfully among the ferns!',
    emoji: '🐦',
    image: quailQuinnImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#854D0E',
    habitat: 'Fern & Meadow Glen',
    words: [
      { word: 'Quail', phonetic: 'Quail', emoji: '🐦', prompt: 'Quail! Cute feather plume on head!' },
      { word: 'Quick', phonetic: 'Quick', emoji: '⚡', prompt: 'Quick! Speedy like the jungle breeze!' },
      { word: 'Quiet', phonetic: 'Qui • et', emoji: '🤫', prompt: 'Quiet! Shh in the gentle forest!' },
    ],
  },
  R: {
    letter: 'R',
    name: 'Roxy the Rhino',
    phonics: 'R is for Rhino!',
    audioPrompt: 'R is for Rhino! Roxy the gentle Rhino roaming the golden plains!',
    emoji: '🦏',
    image: rhinoRoxyImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#57534E',
    habitat: 'Rock & Savannah Plains',
    words: [
      { word: 'Rhino', phonetic: 'Rhi • no', emoji: '🦏', prompt: 'Rhino! Big horn and gentle heart!' },
      { word: 'River', phonetic: 'Riv • er', emoji: '🌊', prompt: 'River! Fresh sparkling water!' },
      { word: 'Rainbow', phonetic: 'Rain • bow', emoji: '🌈', prompt: 'Rainbow! Seven bright colors in the sky!' },
    ],
  },
  S: {
    letter: 'S',
    name: 'Sammy the Sloth',
    phonics: 'S is for Sloth!',
    audioPrompt: 'S is for Sloth! Sammy hanging cozy and smiling slowly in the mossy trees!',
    emoji: '🦥',
    image: slothSammyImg,
    strokes: 1,
    strokeTitle: '1 Squiggly Stroke',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#78350F',
    habitat: 'High Sleepy Canopy',
    words: [
      { word: 'Sloth', phonetic: 'Sloth', emoji: '🦥', prompt: 'Sloth! Sweet sleepy jungle friend!' },
      { word: 'Snake', phonetic: 'Snake', emoji: '🐍', prompt: 'Snake! Slithers smoothly on vines!' },
      { word: 'Sun', phonetic: 'Sun', emoji: '☀️', prompt: 'Sun! Warm golden morning sunshine!' },
    ],
  },
  T: {
    letter: 'T',
    name: 'Toco the Toucan',
    phonics: 'T is for Toucan!',
    audioPrompt: 'T is for Toucan! Toco the Toucan with a brilliant rainbow beak!',
    emoji: '🦜',
    image: toucanIslandImg,
    strokes: 2,
    strokeTitle: '2 Fun Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#EA580C',
    habitat: 'Sunlit Palm Coast',
    words: [
      { word: 'Toucan', phonetic: 'Tou • can', emoji: '🦜', prompt: 'Toucan! Bright colorful beak!', sound: 'toucan' },
      { word: 'Tree', phonetic: 'Tree', emoji: '🌳', prompt: 'Tree! Ancient tall jungle tree!' },
      { word: 'Tiger', phonetic: 'Ti • ger', emoji: '🐯', prompt: 'Tiger! Striped friend of the jungle!' },
    ],
  },
  U: {
    letter: 'U',
    name: 'Uma the Umbrella Bird',
    phonics: 'U is for Umbrella Bird!',
    audioPrompt: 'U is for Umbrella Bird! Uma with a magnificent feather crest!',
    emoji: '🪶',
    image: umbrellaBirdUmaImg,
    strokes: 1,
    strokeTitle: '1 Smooth Curve',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#1E3A8A',
    habitat: 'Cloud Forest Peak',
    words: [
      { word: 'Umbrella', phonetic: 'Um • brel • la', emoji: '☂️', prompt: 'Umbrella! Protects from jungle rain!' },
      { word: 'Under', phonetic: 'Un • der', emoji: '⬇️', prompt: 'Under! Under the shady leaves!' },
      { word: 'Up', phonetic: 'Up', emoji: '⬆️', prompt: 'Up! Up high in the blue sky!' },
    ],
  },
  V: {
    letter: 'V',
    name: 'Vicki the Viper',
    phonics: 'V is for Viper!',
    audioPrompt: 'V is for Viper! Vicki the friendly tree viper resting peacefully on the vine!',
    emoji: '🐍',
    image: viperVickiImg,
    strokes: 2,
    strokeTitle: '2 Slanted Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#15803D',
    habitat: 'Emerald Vine Canopy',
    words: [
      { word: 'Vine', phonetic: 'Vine', emoji: '🌿', prompt: 'Vine! Long green jungle vine!' },
      { word: 'Volcano', phonetic: 'Vol • ca • no', emoji: '🌋', prompt: 'Volcano! Towering in the distance!' },
      { word: 'Village', phonetic: 'Vil • lage', emoji: '🏡', prompt: 'Village! Happy friends living together!' },
    ],
  },
  W: {
    letter: 'W',
    name: 'Wally the Whale',
    phonics: 'W is for Whale!',
    audioPrompt: 'W is for Whale! Wally the baby whale splashing joyful water in the ocean!',
    emoji: '🐋',
    image: whaleWallyImg,
    strokes: 4,
    strokeTitle: '4 Slanted Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#0369A1',
    habitat: 'Deep Blue Bay',
    words: [
      { word: 'Whale', phonetic: 'Whale', emoji: '🐋', prompt: 'Whale! Gentle giant of the deep blue!' },
      { word: 'Water', phonetic: 'Wa • ter', emoji: '💧', prompt: 'Water! Cool sparkling splash!' },
      { word: 'Wind', phonetic: 'Wind', emoji: '💨', prompt: 'Wind! Gentle tropical breeze!' },
    ],
  },
  X: {
    letter: 'X',
    name: 'Xavier the X-Ray Fish',
    phonics: 'X is for X-Ray Fish!',
    audioPrompt: 'X is for X-Ray Fish! Xavier swimming clear and glowing in the stream!',
    emoji: '🐟',
    image: xrayFishXavierImg,
    strokes: 2,
    strokeTitle: '2 Crossing Strokes',
    difficulty: 'EASY',
    level: 'Level 1',
    themeColor: '#0891B2',
    habitat: 'Crystal Jungle Stream',
    words: [
      { word: 'X-Ray', phonetic: 'X-Ray', emoji: '🩻', prompt: 'X-Ray! Seeing clear inside!' },
      { word: 'Xylophone', phonetic: 'Xy • lo • phone', emoji: '🎼', prompt: 'Xylophone! Ding ding happy melodies!' },
      { word: 'Fox', phonetic: 'Fox', emoji: '🦊', prompt: 'Fox! Clever friend with an X sound!' },
    ],
  },
  Y: {
    letter: 'Y',
    name: 'Yanni the Yak',
    phonics: 'Y is for Yak!',
    audioPrompt: 'Y is for Yak! Yanni the fluffy yak smiling on the sunny mountain hills!',
    emoji: '🐂',
    image: yakYanniImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#854D0E',
    habitat: 'High Mountain Pass',
    words: [
      { word: 'Yak', phonetic: 'Yak', emoji: '🐂', prompt: 'Yak! Shaggy curly-horned mountain friend!' },
      { word: 'Yellow', phonetic: 'Yel • low', emoji: '💛', prompt: 'Yellow! Warm sunny buttercup!' },
      { word: 'Yawn', phonetic: 'Yawn', emoji: '🥱', prompt: 'Yawn! Time for cozy bedtime!' },
    ],
  },
  Z: {
    letter: 'Z',
    name: 'Ziggy the Zebra',
    phonics: 'Z is for Zebra!',
    audioPrompt: 'Z is for Zebra! Ziggy galloping joyfully with black and white stripes!',
    emoji: '🦓',
    image: zebraZiggyImg,
    strokes: 3,
    strokeTitle: '3 Fun Strokes',
    difficulty: 'MEDIUM',
    level: 'Level 2',
    themeColor: '#374151',
    habitat: 'Sunlit Wildflower Plain',
    words: [
      { word: 'Zebra', phonetic: 'Ze • bra', emoji: '🦓', prompt: 'Zebra! Beautiful striped safari friend!' },
      { word: 'Zoo', phonetic: 'Zoo', emoji: '🦁', prompt: 'Zoo! Wildlife paradise!' },
      { word: 'Zigzag', phonetic: 'Zig • zag', emoji: '⚡', prompt: 'Zigzag! Fun twisting trail!' },
    ],
  },
};

export const AlphabetScreen = ({ onAddStars, savedLetter = 'A', onSelectLetter, onTaskCompleted }) => {
  const [selectedLetter, setSelectedLetter] = useState(savedLetter || 'A');
  const [tracerVisible, setTracerVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [trailFilter, setTrailFilter] = useState('all'); // 'all' (A-Z) or 'zone3' (J-O)
  const ribbonScrollRef = useRef(null);

  const { isMuted, toggleMute, isMusicPlaying, toggleMusic } = useSoundMute();

  const allLetters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  const zone3Letters = ['J', 'K', 'L', 'M', 'N', 'O'];

  const lettersRibbon = trailFilter === 'zone3' ? zone3Letters : allLetters;
  const currentData = LETTER_DATABASE[selectedLetter] || LETTER_DATABASE.A;

  // Sync with prop when returning to screen
  useEffect(() => {
    if (savedLetter && savedLetter !== selectedLetter) {
      setSelectedLetter(savedLetter);
    }
  }, [savedLetter]);

  // Smoothly scroll active letter into view in ribbon
  useEffect(() => {
    const idx = lettersRibbon.indexOf(selectedLetter);
    if (idx >= 0 && ribbonScrollRef.current) {
      const scrollPos = Math.max(0, idx * 64 - 100);
      try {
        if (ribbonScrollRef.current.scrollTo) {
          ribbonScrollRef.current.scrollTo({ x: scrollPos, animated: true });
        }
      } catch {}
    }
  }, [selectedLetter, trailFilter]);

  const handleScrollRibbonLeft = () => {
    sounds.playTap();
    const idx = lettersRibbon.indexOf(selectedLetter);
    const nextIdx = Math.max(0, idx - 4);
    const targetLetter = lettersRibbon[nextIdx];
    setSelectedLetter(targetLetter);
    handleLetterSelect(targetLetter);
  };

  const handleScrollRibbonRight = () => {
    sounds.playTap();
    const idx = lettersRibbon.indexOf(selectedLetter);
    const nextIdx = Math.min(lettersRibbon.length - 1, idx + 4);
    const targetLetter = lettersRibbon[nextIdx];
    setSelectedLetter(targetLetter);
    handleLetterSelect(targetLetter);
  };

  const handleHearSound = () => {
    if (isMuted) {
      toggleMute();
      setTimeout(() => {
        sounds.playTap();
        sounds.playAnimal(selectedLetter);
        setTimeout(() => {
          sounds.speak(`${currentData.name}! ${currentData.phonics}`, 0.9, 1.2);
        }, 400);
      }, 50);
      return;
    }
    sounds.playTap();
    sounds.playAnimal(selectedLetter);
    setTimeout(() => {
      sounds.speak(`${currentData.name}! ${currentData.phonics}`, 0.9, 1.2);
    }, 400);
  };

  const handleWordTap = (index, wordItem) => {
    sounds.playTap();
    setActiveCard(index);

    if (wordItem.sound) {
      sounds.playAnimal(wordItem.sound);
    } else {
      sounds.playAnimal(wordItem.word);
    }

    sounds.speak(wordItem.prompt || `${wordItem.word}!`);
    setTimeout(() => {
      setActiveCard(null);
    }, 400);
  };

  const handleLetterSelect = (letter) => {
    sounds.playTap();
    setSelectedLetter(letter);
    if (onSelectLetter) {
      onSelectLetter(letter);
    }
    const data = LETTER_DATABASE[letter];
    if (data && data.words && data.words.length > 0) {
      // 1. Play the animal's dedicated signature sound!
      sounds.playAnimal(letter);
      // 2. Pronounce the animal name & letter
      const primaryWord = data.words[0].word;
      setTimeout(() => {
        sounds.speak(`${data.name}! ${letter} is for ${primaryWord}!`);
      }, 350);
    } else {
      sounds.speak(letter);
    }
  };

  const handleTraceComplete = () => {
    if (onAddStars) onAddStars(3);
    if (onTaskCompleted) onTaskCompleted();
  };

  // Dynamic SVG stroke representation for each letter
  // Dynamic SVG stroke representation for each letter (A through Z)
  const renderStrokeSvg = () => {
    const l = selectedLetter;
    if (l === 'A') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 25 4 L 12 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 25 4 L 38 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 20 L 34 20" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="25" cy="4" r="3" fill="#006c49"/>
          <circle cx="12" cy="30" r="3" fill="#ffb702"/>
          <circle cx="38" cy="30" r="3" fill="#006c49"/>
        </svg>
      );
    }
    if (l === 'B') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 16 4 L 16 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 5 C 30 5 30 17 16 17" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 16 17 C 32 17 32 30 16 30" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="16" cy="4" r="3" fill="#006c49"/>
          <circle cx="16" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'C') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 36 8 C 16 5 12 28 36 26" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="36" cy="8" r="3.5" fill="#006c49"/>
          <circle cx="36" cy="26" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'D') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 16 4 L 16 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 5 C 34 5 34 29 16 29" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="16" cy="4" r="3" fill="#006c49"/>
          <circle cx="16" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'E') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 16 4 L 16 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 5 L 34 5" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 16 17 L 30 17" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 16 29 L 34 29" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="16" cy="4" r="3" fill="#006c49"/>
          <circle cx="34" cy="5" r="2.5" fill="#ffb702"/>
          <circle cx="34" cy="29" r="2.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'F') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 16 4 L 16 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 5 L 34 5" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 16 17 L 29 17" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="16" cy="4" r="3" fill="#006c49"/>
          <circle cx="34" cy="5" r="2.5" fill="#ffb702"/>
          <circle cx="16" cy="30" r="3" fill="#006c49"/>
        </svg>
      );
    }
    if (l === 'G') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 35 9 C 16 5 12 28 25 28 C 32 28 35 25 35 19 L 25 19" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="35" cy="9" r="3" fill="#006c49"/>
          <circle cx="25" cy="19" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'H') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 15 4 L 15 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 35 4 L 35 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 15 17 L 35 17" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="15" cy="4" r="3" fill="#006c49"/>
          <circle cx="35" cy="4" r="3" fill="#006c49"/>
          <circle cx="35" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'I') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 17 5 L 33 5" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 25 5 L 25 29" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 17 29 L 33 29" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="25" cy="5" r="3.5" fill="#006c49"/>
          <circle cx="25" cy="29" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'J') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 32 4 L 32 20 C 32 28 18 29 14 22" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="32" cy="4" r="3.5" fill="#006c49"/>
          <circle cx="14" cy="22" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'K') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 14 4 L 14 30" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 34 5 L 16 18 L 36 30" stroke="#ffb702" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="14" cy="4" r="3" fill="#006c49"/>
          <circle cx="34" cy="5" r="3" fill="#7d5800"/>
          <circle cx="36" cy="30" r="3" fill="#10b981"/>
        </svg>
      );
    }
    if (l === 'L') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 18 4 L 18 28 L 38 28" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="18" cy="4" r="3.5" fill="#006c49"/>
          <circle cx="38" cy="28" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'M') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 10 30 L 10 5 L 25 20 L 40 5 L 40 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="10" cy="30" r="3" fill="#006c49"/>
          <circle cx="25" cy="20" r="2.5" fill="#ffb702"/>
          <circle cx="40" cy="30" r="3" fill="#006c49"/>
        </svg>
      );
    }
    if (l === 'N') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 12 30 L 12 5 L 38 30 L 38 5" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="12" cy="30" r="3" fill="#006c49"/>
          <circle cx="38" cy="5" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'O') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <circle cx="25" cy="17" r="12" stroke="#10b981" strokeWidth="4" strokeDasharray="3 3"/>
          <circle cx="25" cy="5" r="3" fill="#006c49"/>
          <circle cx="25" cy="29" r="2.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'P') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 16 4 L 16 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 16 5 C 34 5 34 18 16 18" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="16" cy="4" r="3" fill="#006c49"/>
          <circle cx="16" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'Q') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <circle cx="23" cy="16" r="11" stroke="#10b981" strokeWidth="3.5" strokeDasharray="3 3"/>
          <path d="M 27 22 L 38 30" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="23" cy="5" r="3" fill="#006c49"/>
          <circle cx="38" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'R') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 15 4 L 15 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 15 5 C 33 5 33 17 15 17" stroke="#ffb702" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 24 17 L 36 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="15" cy="4" r="3" fill="#006c49"/>
          <circle cx="36" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'S') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 35 9 C 22 5 14 15 25 18 C 36 21 32 29 15 28" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="35" cy="9" r="3.5" fill="#006c49"/>
          <circle cx="15" cy="28" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'T') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 13 5 L 37 5" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M 25 5 L 25 30" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="25" cy="5" r="3.5" fill="#006c49"/>
          <circle cx="25" cy="30" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'U') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 15 4 L 15 21 C 15 31 35 31 35 21 L 35 4" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="15" cy="4" r="3.5" fill="#006c49"/>
          <circle cx="35" cy="4" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'V') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 14 4 L 25 30 L 36 4" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="14" cy="4" r="3" fill="#006c49"/>
          <circle cx="25" cy="30" r="3" fill="#ffb702"/>
          <circle cx="36" cy="4" r="3" fill="#006c49"/>
        </svg>
      );
    }
    if (l === 'W') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 10 4 L 17 30 L 25 15 L 33 30 L 40 4" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="10" cy="4" r="2.5" fill="#006c49"/>
          <circle cx="25" cy="15" r="2.5" fill="#ffb702"/>
          <circle cx="40" cy="4" r="2.5" fill="#006c49"/>
        </svg>
      );
    }
    if (l === 'X') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 14 4 L 36 30" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M 36 4 L 14 30" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="14" cy="4" r="3" fill="#006c49"/>
          <circle cx="36" cy="30" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'Y') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 14 4 L 25 17 L 36 4" stroke="#ffb702" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
          <path d="M 25 17 L 25 30" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3"/>
          <circle cx="14" cy="4" r="3" fill="#006c49"/>
          <circle cx="36" cy="4" r="3" fill="#006c49"/>
          <circle cx="25" cy="30" r="3.5" fill="#ffb702"/>
        </svg>
      );
    }
    if (l === 'Z') {
      return (
        <svg width="50" height="34" viewBox="0 0 50 34" fill="none">
          <path d="M 14 6 L 36 6 L 14 28 L 36 28" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
          <circle cx="14" cy="6" r="3" fill="#006c49"/>
          <circle cx="36" cy="28" r="3" fill="#ffb702"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Uniform Top Explorer Banner */}
      <View style={styles.viewBannerCard}>
        <View style={styles.viewBannerDecorCircle1} />
        <View style={styles.viewBannerDecorCircle2} />

        <View style={styles.viewBannerHeaderRow}>
          <View style={styles.viewTagRow}>
            <View style={[styles.viewBadge, { backgroundColor: colors.primaryContainer }]}>
              <BookA size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.viewTextColumn}>
              <Text style={styles.viewCategoryTag}>ALPHABET ISLAND</Text>
              <Text style={styles.viewMainTitle}>Letter Exploration 🌴</Text>
            </View>
          </View>

          {/* Voice Helper / Phonics Audio Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            activeOpacity={0.85}
            onPress={handleHearSound}
            accessibilityLabel={isMuted ? "Unmute and hear sound" : "Hear sound"}
          >
            <Text style={styles.voiceIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>

        {/* Trail Mode Switcher: All A-Z vs Zone 3 */}
        <View style={styles.trailModeSwitchRow}>
          <TouchableOpacity
            style={[styles.trailModePill, trailFilter === 'all' && styles.trailModePillActive]}
            activeOpacity={0.8}
            onPress={() => setTrailFilter('all')}
          >
            <Text style={[styles.trailModeText, trailFilter === 'all' && styles.trailModeTextActive]}>
              All A–Z (26 Letters)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.trailModePill, trailFilter === 'zone3' && styles.trailModePillActive]}
            activeOpacity={0.8}
            onPress={() => setTrailFilter('zone3')}
          >
            <Text style={[styles.trailModeText, trailFilter === 'zone3' && styles.trailModeTextActive]}>
              Zone 3 Island (J–O)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Letter Ribbon Carousel */}
      <View style={styles.ribbonSection}>
        <View style={styles.ribbonHeader}>
          <View style={styles.ribbonTitleRow}>
            <Text style={styles.ribbonIcon}>🌱</Text>
            <Text style={styles.ribbonTitle}>Alphabet Trail</Text>
          </View>

          {/* Sound & Music Controls */}
          <View style={styles.ribbonActionsRow}>
            <TouchableOpacity
              style={[styles.audioPill, isMuted && styles.audioPillMuted]}
              activeOpacity={0.8}
              onPress={toggleMute}
              accessibilityLabel={isMuted ? "Unmute sound" : "Mute sound"}
            >
              <Text style={styles.audioPillEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
              <Text style={[styles.audioPillText, isMuted && styles.audioPillTextMuted]}>
                {isMuted ? 'Muted' : 'Sound'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.audioPill, !isMusicPlaying && styles.audioPillMuted]}
              activeOpacity={0.8}
              onPress={() => {
                const next = toggleMusic();
                sounds.playTap();
                sounds.speak(next ? 'Music playing' : 'Music off');
              }}
              accessibilityLabel={isMusicPlaying ? "Turn music off" : "Turn music on"}
            >
              <Text style={styles.audioPillEmoji}>{isMusicPlaying ? '🎵' : '🔇'}</Text>
              <Text style={[styles.audioPillText, !isMusicPlaying && styles.audioPillTextMuted]}>
                {isMusicPlaying ? 'Music: ON' : 'Music: OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Letter Trail with Left & Right Arrow Buttons */}
        <View style={styles.ribbonRowContainer}>
          <TouchableOpacity
            style={styles.ribbonArrowBtn}
            activeOpacity={0.75}
            onPress={handleScrollRibbonLeft}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 6 }}
            accessibilityLabel="Previous letters"
          >
            <Text style={styles.ribbonArrowText}>◀</Text>
          </TouchableOpacity>

          <ScrollView
            ref={ribbonScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.ribbonScrollView}
            contentContainerStyle={styles.ribbonScroll}
          >
            {lettersRibbon.map((letter) => {
              const isSelected = selectedLetter === letter;

              return (
                <TouchableOpacity
                  key={letter}
                  activeOpacity={0.8}
                  onPress={() => handleLetterSelect(letter)}
                  style={[
                    styles.ribbonLetterBtn,
                    isSelected && styles.ribbonLetterActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.ribbonLetterText,
                      isSelected && styles.ribbonLetterTextActive,
                    ]}
                  >
                    {letter}
                  </Text>

                  {/* ONLY active alphabet has tick mark */}
                  {isSelected && (
                    <View style={styles.activeCheckBadge}>
                      <Text style={styles.activeCheckmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.ribbonArrowBtn}
            activeOpacity={0.75}
            onPress={handleScrollRibbonRight}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 10 }}
            accessibilityLabel="Next letters"
          >
            <Text style={styles.ribbonArrowText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Tactile Exploration Card */}
      <View style={styles.mainExplorationCard}>
        {/* Letter & Phonics Header Banner */}
        <View style={styles.cardHeader}>
          <View style={styles.letterBigBadge}>
            <Text style={styles.letterBigUppercase}>{currentData.letter}</Text>
            <Text style={styles.letterBigLowercase}>{currentData.letter.toLowerCase()}</Text>
          </View>

          {/* Phonics Audio Trigger with Mute Awareness */}
          <TouchableOpacity
            style={[styles.hearSoundBtn, isMuted && styles.hearSoundBtnMuted]}
            activeOpacity={0.85}
            onPress={handleHearSound}
          >
            <Text style={styles.hearSoundIcon}>{isMuted ? '🔇' : '🔊'}</Text>
            <Text style={styles.hearSoundText}>
              {isMuted ? 'Unmute & Play' : 'Hear Sound'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center Stage Hero Illustration: Associated image in similar view */}
        <TouchableOpacity
          style={styles.heroStageContainer}
          activeOpacity={0.9}
          onPress={handleHearSound}
          accessibilityLabel={`Listen to ${currentData.name}`}
        >
          {currentData.image ? (
            <Image
              source={{ uri: currentData.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            /* Custom Scenic Habitat Backdrop for letters without photo files */
            <View style={[styles.scenicBackdrop, { backgroundColor: currentData.themeColor || '#006C49' }]}>
              <View style={styles.scenicSunGlow} />
              <View style={styles.scenicHillLeft} />
              <View style={styles.scenicHillRight} />
              
              <View style={styles.scenicFloraRow}>
                <Text style={styles.scenicFlora}>🌿</Text>
                <Text style={styles.scenicFlora}>🌴</Text>
              </View>

              {/* Large 3D Animal Avatar Centerpiece */}
              <View style={styles.scenicAnimalBadge}>
                <Text style={styles.scenicAnimalEmoji}>{currentData.emoji}</Text>
              </View>

              <View style={styles.scenicHabitatPill}>
                <Text style={styles.scenicHabitatText}>📍 {currentData.habitat || 'Jungle Habitat'}</Text>
              </View>
            </View>
          )}

          {/* Character Badge Overlay */}
          <View style={styles.heroBadgeTop}>
            <Text style={styles.sparkleIcon}>✨</Text>
            <Text style={styles.heroBadgeText}>{currentData.name}</Text>
          </View>

          {/* Phonics Speech Bubble */}
          <TouchableOpacity
            style={styles.phonicsSpeechBubble}
            activeOpacity={0.85}
            onPress={handleHearSound}
          >
            <Text style={styles.phonicsBubbleText}>{currentData.phonics}</Text>
            <Text style={styles.phonicsMusicIcon}>🎵</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Finger Guide & Strokes Preview */}
        <View style={styles.fingerGuideRow}>
          <View style={styles.guideTextColumn}>
            <Text style={styles.guideSubtitle}>FINGER GUIDE</Text>
            <Text style={styles.guideTitle}>{currentData.strokeTitle || `${currentData.strokes} Fun Strokes`}</Text>
          </View>

          {/* Mini Stroke Visual Preview Box */}
          <View style={styles.strokePreviewBox}>
            {renderStrokeSvg()}
            <View style={styles.guidePawDot}>
              <Text style={styles.guidePawText}>🐾</Text>
            </View>
          </View>

          {/* Easy/Medium Level Chip */}
          <View style={styles.difficultyChip}>
            <Text style={styles.diffPrimary}>{currentData.difficulty || 'EASY'}</Text>
            <Text style={styles.diffSecondary}>{currentData.level || 'Level 1'}</Text>
          </View>
        </View>

        {/* Tappable Vocabulary Chips ("Sound Toys") */}
        <View style={styles.vocabSection}>
          <View style={styles.vocabHeader}>
            <Text style={styles.vocabTitle}>TAP TO SPEAK</Text>
            <View style={styles.wordsCountTag}>
              <Text style={styles.touchEmoji}>👆</Text>
              <Text style={styles.wordsCountText}>{currentData.words.length} Words</Text>
            </View>
          </View>

          <View style={styles.vocabGrid}>
            {currentData.words.map((item, index) => {
              const isTapped = activeCard === index;
              return (
                <TouchableOpacity
                  key={item.word}
                  activeOpacity={0.8}
                  onPress={() => handleWordTap(index, item)}
                  style={[
                    styles.vocabCard,
                    isTapped && styles.vocabCardActive,
                  ]}
                >
                  <View style={[styles.vocabEmojiCircle, isTapped && styles.vocabEmojiCircleActive]}>
                    <Text style={styles.vocabEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.vocabWordText}>{item.word}</Text>
                  <Text style={styles.vocabPhoneticText}>{item.phonetic}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Primary Action Button: Trace Letter */}
        <SquishyButton
          variant="primary"
          size="lg"
          onPress={() => setTracerVisible(true)}
          style={styles.traceActionBtn}
          icon={<Text style={styles.traceBtnIcon}>✏️</Text>}
          rightElement={
            <View style={styles.starRewardPill}>
              <Text style={styles.starRewardEmoji}>⭐</Text>
              <Text style={styles.starRewardText}>+3</Text>
            </View>
          }
        >
          Trace Letter {currentData.letter}
        </SquishyButton>
      </View>

      {/* Interactive Handwriting / Finger Tracer Modal */}
      <LetterTracer
        visible={tracerVisible}
        letter={selectedLetter}
        onClose={() => setTracerVisible(false)}
        onComplete={handleTraceComplete}
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
  },
  ribbonRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  ribbonArrowBtn: {
    width: 30,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 53, 15, 0.15)',
    zIndex: 2,
  },
  ribbonArrowText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '900',
  },
  ribbonScrollView: {
    flex: 1,
  },
  viewBannerCard: {
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
    marginBottom: 16,
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
    marginBottom: 14,
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
    borderBottomColor: colors.primaryDark,
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
    color: colors.primary,
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
  trailModeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
  },
  trailModePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1.5,
    borderColor: 'rgba(120, 53, 15, 0.12)',
    cursor: 'pointer',
  },
  trailModePillActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryDark,
  },
  trailModeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  trailModeTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  ribbonSection: {
    marginBottom: 14,
  },
  ribbonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  ribbonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ribbonIcon: {
    fontSize: 18,
  },
  ribbonTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: colors.onSurface,
  },
  ribbonActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    cursor: 'pointer',
  },
  audioPillMuted: {
    backgroundColor: '#FEF2F2',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  audioPillEmoji: {
    fontSize: 11,
  },
  audioPillText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  audioPillTextMuted: {
    color: '#DC2626',
  },
  ribbonZoneBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(120, 53, 15, 0.1)',
    cursor: 'pointer',
  },
  ribbonZoneText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  ribbonScroll: {
    paddingVertical: 8,
    gap: 10,
    alignItems: 'center',
  },
  ribbonLetterBtn: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainer,
    borderBottomWidth: 4,
    borderBottomColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  ribbonLetterActive: {
    width: 62,
    height: 62,
    backgroundColor: colors.secondaryContainer,
    borderBottomColor: colors.secondaryDark,
    borderBottomWidth: 5,
    transform: [{ scale: 1.05 }],
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  ribbonLetterText: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.onSurface,
  },
  ribbonLetterTextActive: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
  activeCheckBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#00422B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  activeCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 14,
  },
  mainExplorationCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: 16,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  letterBigBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceVariant,
  },
  letterBigUppercase: {
    fontFamily: typography.displayHero.fontFamily,
    fontSize: 38,
    fontWeight: '900',
    color: colors.secondaryContainer,
    lineHeight: 42,
  },
  letterBigLowercase: {
    fontFamily: typography.displayHeroMobile.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: colors.secondaryContainer,
    lineHeight: 32,
  },
  hearSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderBottomWidth: 4,
    borderBottomColor: colors.tertiaryDark,
    cursor: 'pointer',
  },
  hearSoundBtnMuted: {
    backgroundColor: '#9CA3AF',
    borderBottomColor: '#6B7280',
  },
  hearSoundIcon: {
    fontSize: 20,
  },
  hearSoundText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroStageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: borderRadius.default,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  scenicBackdrop: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenicSunGlow: {
    position: 'absolute',
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 235, 150, 0.35)',
  },
  scenicHillLeft: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 160,
    height: 100,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  scenicHillRight: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    width: 200,
    height: 120,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  scenicFloraRow: {
    position: 'absolute',
    bottom: 14,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  scenicFlora: {
    fontSize: 32,
    opacity: 0.85,
  },
  scenicAnimalBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scale: 1.08 }],
  },
  scenicAnimalEmoji: {
    fontSize: 52,
  },
  scenicHabitatPill: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  scenicHabitatText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  heroBadgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  sparkleIcon: {
    fontSize: 14,
  },
  heroBadgeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
  },
  phonicsSpeechBubble: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    cursor: 'pointer',
  },
  phonicsBubbleText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  phonicsMusicIcon: {
    fontSize: 14,
  },
  fingerGuideRow: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  guideTextColumn: {
    gap: 2,
  },
  guideSubtitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  guideTitle: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: colors.onSurface,
  },
  strokePreviewBox: {
    position: 'relative',
    width: 76,
    height: 46,
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidePawDot: {
    position: 'absolute',
    top: 3,
    left: 4,
  },
  guidePawText: {
    fontSize: 10,
  },
  difficultyChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  diffPrimary: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
  },
  diffSecondary: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 9,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  vocabSection: {
    gap: 8,
  },
  vocabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  vocabTitle: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  wordsCountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  touchEmoji: {
    fontSize: 12,
  },
  wordsCountText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  vocabGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vocabCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.default,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.surfaceVariant,
    cursor: 'pointer',
    gap: 3,
  },
  vocabCardActive: {
    transform: [{ scale: 1.06 }],
    borderColor: colors.secondaryContainer,
  },
  vocabEmojiCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  vocabEmojiCircleActive: {
    backgroundColor: colors.secondaryContainer,
  },
  vocabEmoji: {
    fontSize: 20,
  },
  vocabWordText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
  },
  vocabPhoneticText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  traceActionBtn: {
    marginTop: 4,
  },
  traceBtnIcon: {
    fontSize: 20,
  },
  starRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  starRewardEmoji: {
    fontSize: 14,
  },
  starRewardText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: colors.onSecondaryFixed,
  },
});
