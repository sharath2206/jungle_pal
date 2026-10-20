# 🌴 Jungle Pals - Kids Early Learning App

> Built with **React Native** from the **Google Stitch** text-to-UI specification for **Kids Early Learning App** (`projects/17048351715579457525`).

---

## 🌟 Overview

**Jungle Pals** is a playful, tactile early childhood learning app designed for young learners aged 3 to 7. Set in a sun-drenched jungle canopy, education feels like an open-ended expedition guided by friendly animal companions: **Lion Cub Leo**, **Toco the Toucan**, **Milo the Monkey**, and **Ellie the Elephant**.

---

## 🎨 Design System: *Jungle Safari Play*

- **Visual Movement**: Tactile / Skeuomorphic Charm with Modern Rounded Minimalism.
- **Colors**:
  - **Leaf Green Primary** (`#10B981` / `#006C49`, 3D base lip `#065F46`)
  - **Sunburst Yellow Secondary** (`#FFB703` / `#FFB702`, 3D base lip `#D97706`)
  - **Canopy Sky Blue Tertiary** (`#38BDF8` / `#19AEE8`, 3D base lip `#0284C7`)
  - **Warm Organic Cream Surfaces** (`#FFF8F6`, `#FFEAE1`, `#FFF1EB`)
  - **Safari Bark Neutral** (`#78350F` / `#351000`)
- **Typography**:
  - **Rubik** (ExtraBold / Black `700`–`900`): Large bouncy headlines, badges, and chunky buttons.
  - **Nunito Sans** (`600`–`700`): Developmental phonemic readability for instructions and labels.
- **Elevation & Physics**:
  - Physical 3D squishy buttons with 4px–5px bottom rim lips.
  - Active press depression mechanics (`translateY(3px)`).
  - Minimum tap dimensions of 56px–64px for developing fine motor skills.

---

## 🚀 Fully Functional Screens

### 1. 🗺️ World Map (`WorldMapScreen.jsx`)
- **Good Morning Leo greeting banner** with Level 3 Junior Ranger status.
- **Voice Guide Companion button**: Plays audio speech: *"Pick a path to start playing, Leo! Toucan, Milo, and Ellie are waiting for you!"*
- **Daily Safari Quest**: *"Find 3 Letter A animals today!"* (+5 Stars interactive checkbox).
- **Interactive Winding Stepping Trail**:
  - **Zone 1: Sunlit Coast** – Toco the Toucan, Alphabet Island (14/26 Letters Mastered), 3 Golden Stars, "Start Adventure" button.
  - **Zone 2: Canopy Trail** – Milo the Monkey, Word Forest (8 Story Adventures completed), "Play Words" button.
  - **Zone 3: Sparkling Oasis** – Ellie the Elephant, Number Safari (Numbers 1–20), "Count with Ellie" button.
  - **Zone 4: Volcano Valley** – Locked milestone zone ("Unlocks at 30 Stars • 6 to go!").

### 2. 🔤 Alphabet Island (`AlphabetScreen.jsx`)
- **Letter Ribbon Carousel**: Quick horizontal navigation across letters (J, K, L, M, N, O).
- **Hero Card**:
  - Big tactile letter shapes **"L"** and **"l"** with warm dot highlights.
  - **Phonics Audio Button**: Speaks *"L! /l/ • /l/ • Lion! Rawr!"* with speech synthesis.
  - **Center Stage Illustration**: Adorable 3D clay-style baby lion with turquoise butterfly.
  - **Speech Bubble Trigger**: Tap to hear pronunciation.
- **Guided Finger Tracer**:
  - Mini-guide showing 2 Fun Strokes (Stroke 1: Down ⬇️, Stroke 2: Across ➡️).
  - Interactive handwriting canvas modal where children trace Letter L with their finger or mouse!
  - Confetti explosion and +3 Stars on completion!
- **Sound Toys Vocabulary Cards**:
  - 🦁 **Lion** (`/laɪ.ən/`) – Tap to roar!
  - 🍃 **Leaf** (`/liːf/`) – Tap to rustle!
  - 🍋 **Lemon** (`/ˈlem.ən/`) – Tap to pop!

### 3. 🔢 Number Safari (`NumberScreen.jsx`)
- **Stage 5**: "FIVE" with visual dot counters.
- **Interactive Feeding Game**:
  - Hungry Milo the Monkey: *"Can you give him 5 yummy bananas?"*
  - Tap the bouncy golden 5th banana or the action button!
  - Watch the banana fly into Milo's picnic basket with audio feedback!
- **Safari Wooden Tray**: 5 real-time slots showing items collected.
- **10-Frame Math Foundation**: Visual base-10 frame showing 5 filled and 5 empty slots ("Half Full!").
- **Celebration Modal**: Confetti burst, monkey chatter, and Math Badge unlock!

### 4. 🧩 Word Builder Safari Puzzle (`WordBuilderScreen.jsx`)
- **Storybook Scene**: Cozy sleeping lion cub storybook scene.
- **Audio Mascot Camilo the Chameleon**: *"L - I... what comes next? Find O!"*
- **Target Slots**: `[ L ] [ I ] [ ? ] [ ? ]`
- **Chunky 3D Tile Bank**: `[ O ]` (`/oʊ/`), `[ N ]` (`/en/`), `[ B ]` (`/biː/`), `[ T ]` (`/tiː/`).
- **Phonics Learning**: Tapping the correct tiles snaps them into place with sparkles.
- **Free Hint Button**: Highlights the correct letter with bouncy scale animation.
- **Roaring Success Celebration**: Confetti, coin reward, and progression!

### 5. 🎒 Safari Sticker Album & Parents Zone (`StickerAlbumScreen.jsx`)
- **Explorer Leo's Backpack**: 142 Total Stars, 12 Badges, 8 Adventures.
- **Filter Categories**: Jungle Animals, Alphabet Badges, Number Trophies, Special Quests.
- **Field Notebook (Page 4)**:
  - 🦁 **Roaring Lion** – "Tap to Roar" (audio growl & peel animation)
  - 🐒 **Playful Monkey** – "Master of Words" (monkey chatter)
  - 🐘 **Wise Elephant** – "Numbers 1-10" (trumpet sound)
  - 🦜 **Rainbow Toucan** – "Phonics Champ" (tropical chirp)
  - 🦥 **Sleepy Sloth** – Locked ("Spell 5 animal words")
  - 🐆 **Golden Cheetah** – Locked ("7-Day streak")
- **Parents Zone & Report (Protected by Adult Math Gate)**:
  - Tap the lock to open the adult security challenge: `4 × 2 = ?`
  - Correct answer (8) unlocks parental controls:
    - Screen Time limit selector (20m, 30m, 45m)
    - Phonics accuracy growth stats (94% Great)
    - Full learning progress breakdown

---

## 🛠️ Project Structure

```
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite + React Native Web alias
├── app.json                   # Expo mobile configuration
├── index.html                 # HTML shell with Google Fonts & Material Symbols
├── src/
│   ├── index.js               # React Native AppRegistry entry point
│   ├── App.jsx                # Root app state & navigation
│   ├── theme/
│   │   ├── colors.js          # Jungle Safari Play color tokens
│   │   ├── typography.js      # Rubik & Nunito Sans scale
│   │   └── sounds.js          # Web Audio synthesizer & speech
│   ├── assets/
│   │   └── images/            # High-res 3D character illustrations
│   ├── components/
│   │   ├── Header.jsx         # Gamified top bar (stars, streaks, profile)
│   │   ├── BottomNav.jsx      # Squishy 4-tab bottom navigation
│   │   ├── SquishyButton.jsx  # Reusable 3D tactile button with press mechanics
│   │   ├── AudioSpeaker.jsx   # Voice synthesis prompt button
│   │   ├── LetterTracer.jsx   # Interactive handwriting canvas tracer
│   │   └── CelebrationModal.jsx# Confetti & star reward modal
│   └── screens/
│       ├── WorldMapScreen.jsx # World map & zones exploration
│       ├── AlphabetScreen.jsx # Phonics & Letter L tracing
│       ├── NumberScreen.jsx   # Banana counting & feeding Milo
│       ├── WordBuilderScreen.jsx# Word spelling puzzle
│       └── StickerAlbumScreen.jsx# Sticker album & Adult Math Gate
```

---

## ⚡ Getting Started

### Run Locally (Instant Hot-Reload Web & Mobile Viewport)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in any browser.

### Build for Production

```bash
npm run build
```
"# jungle_pal" 
