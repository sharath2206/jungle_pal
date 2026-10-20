import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, StatusBar, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius } from './theme/colors';
import { typography } from './theme/typography';
import { sounds } from './theme/sounds';
import { Header } from './components/Header';
import { BottomNav, NAV_TABS } from './components/BottomNav';
import { ParentalGateModal } from './components/ParentalGateModal';
import { useParentalControl, parentalControl } from './theme/parentalControl';

import { WorldMapScreen } from './screens/WorldMapScreen';
import { AlphabetScreen } from './screens/AlphabetScreen';
import { NumberScreen } from './screens/NumberScreen';
import { WordBuilderScreen } from './screens/WordBuilderScreen';
import { StickerAlbumScreen } from './screens/StickerAlbumScreen';
import { FootprintOverlay } from './components/FootprintOverlay';
import {
  getSavedFavoriteAnimal,
  saveFavoriteAnimal,
  FAVORITE_ANIMALS,
  getAnimalCursorUri,
} from './theme/footprints';

import lionSleepingImg from './assets/images/lion_sleeping.png';

export default function App() {
  const [activeTab, setActiveTab] = useState(NAV_TABS.WORLD);
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'word_builder'
  const [stars, setStars] = useState(24);
  const [streak, setStreak] = useState('3d');
  const [navHistory, setNavHistory] = useState([{ tab: NAV_TABS.WORLD, view: 'main' }]);

  // Remembers last selected alphabet across tabs (defaults to first alphabet 'A')
  const [lastAlphabet, setLastAlphabet] = useState(() => {
    try {
      return localStorage.getItem('jungle_last_alphabet') || 'A';
    } catch {
      return 'A';
    }
  });

  // Favorite safari companion animal (cheetah by default)
  const [favoriteAnimal, setFavoriteAnimal] = useState(() => getSavedFavoriteAnimal());

  // Daily Safari Quest completion tracking
  const [dailyQuestDone, setDailyQuestDone] = useState(() => {
    try {
      return !!localStorage.getItem('jungle_daily_quest_completed');
    } catch {
      return false;
    }
  });

  // Dynamic animal footprint cursor on desktop & web
  useEffect(() => {
    try {
      const cursorVal = getAnimalCursorUri(favoriteAnimal);
      if (document && document.body) {
        document.body.style.cursor = cursorVal;
      }
      let styleTag = document.getElementById('animal-footprint-cursor-style');
      if (!styleTag && document && document.head) {
        styleTag = document.createElement('style');
        styleTag.id = 'animal-footprint-cursor-style';
        document.head.appendChild(styleTag);
      }
      if (styleTag) {
        styleTag.innerHTML = `
          * { cursor: ${cursorVal} !important; }
        `;
      }
    } catch {}
  }, [favoriteAnimal]);

  // Universal task completion handler for letter tracing, number challenges, and word puzzles
  const handleTaskCompleted = (source) => {
    if (!dailyQuestDone) {
      setDailyQuestDone(true);
      try {
        localStorage.setItem('jungle_daily_quest_completed', new Date().toISOString().slice(0, 10));
      } catch {}
      addStars(5);
      sounds.playSuccess();
      sounds.playSparkle();
      sounds.speak("Hooray! You completed today's Safari Quest! 5 bonus stars awarded!");
    }
  };

  // Parental Control & Lock state
  const {
    kidLockActive,
    toggleKidLock,
    isTimeLimitReached,
    sessionMinutes,
    screenLimit,
    addExtraTime,
  } = useParentalControl();

  const [parentGateVisible, setParentGateVisible] = useState(false);
  const [gateAction, setGateAction] = useState('parent_zone'); // 'parent_zone' | 'unlock_kid_lock'
  const [parentZoneUnlocked, setParentZoneUnlocked] = useState(false);

  // Navigate to any tab/view and record in history stack
  const navigateTo = (tab, view = 'main') => {
    setNavHistory((prev) => [...prev, { tab, view }]);
    setActiveTab(tab);
    setCurrentView(view);
  };

  // Universal Back handler for both In-App button and Android hardware back button
  const handleBack = () => {
    sounds.playTap();
    // 1. If parental security gate is open, close it
    if (parentGateVisible) {
      setParentGateVisible(false);
      return;
    }
    // 2. If in Word Builder sub-view, return to main view
    if (currentView === 'word_builder') {
      setCurrentView('main');
      return;
    }
    // 3. Pop history stack if previous screens exist
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      const prev = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);
      setActiveTab(prev.tab);
      setCurrentView(prev.view);
      return;
    }
    // 4. If on any other tab, return to World Map home
    if (activeTab !== NAV_TABS.WORLD) {
      setActiveTab(NAV_TABS.WORLD);
      setCurrentView('main');
      setNavHistory([{ tab: NAV_TABS.WORLD, view: 'main' }]);
      return;
    }
    // 5. Already at World Map home: speak status
    sounds.speak('You are on the World Map! Explore the jungle!');
  };

  // Android hardware back button & browser popstate listener
  useEffect(() => {
    let backHandle = null;
    import('@capacitor/app')
      .then(({ App: CapApp }) => {
        CapApp.addListener('backButton', () => {
          handleBack();
        }).then((handle) => {
          backHandle = handle;
        });
      })
      .catch(() => {});

    const handlePopState = () => {
      handleBack();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (backHandle && backHandle.remove) backHandle.remove();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBack]);

  const handleAlphabetSelect = (letter) => {
    setLastAlphabet(letter);
    try {
      localStorage.setItem('jungle_last_alphabet', letter);
    } catch {}
  };

  const addStars = (amount) => {
    setStars((prev) => prev + amount);
  };

  const getSubtitle = () => {
    if (currentView === 'word_builder') return 'Lesson Adventure';
    switch (activeTab) {
      case NAV_TABS.WORLD:
        return 'World Map';
      case NAV_TABS.ALPHABET:
        return 'Alphabet Island';
      case NAV_TABS.NUMBERS:
        return 'Number Safari';
      case NAV_TABS.STICKERS:
        return "Leo's Profile & Backpack";
      default:
        return 'Learning Quest';
    }
  };

  const handleTabSelect = (tab) => {
    // If kid-lock is active and user tries to go to Sticker/Parent zone, verify gate
    if (kidLockActive && tab === NAV_TABS.STICKERS) {
      setGateAction('parent_zone');
      setParentGateVisible(true);
      return;
    }
    navigateTo(tab, 'main');
  };

  // Header lock press handler
  const handleHeaderLockPress = () => {
    sounds.playTap();
    if (parentZoneUnlocked) {
      setParentZoneUnlocked(false);
      sounds.speak('Parent Zone locked.');
      return;
    }
    if (kidLockActive) {
      setGateAction('unlock_kid_lock');
      setParentGateVisible(true);
    } else {
      // Prompt parent if they want to lock the app or access controls
      setGateAction('parent_zone');
      setParentGateVisible(true);
    }
  };

  // Successful Parental Gate Unlock
  const handleGateSuccess = () => {
    setParentGateVisible(false);
    if (isTimeLimitReached) {
      addExtraTime(15);
    }
    if (gateAction === 'unlock_kid_lock') {
      if (kidLockActive) {
        toggleKidLock();
      }
      sounds.speak('Unlocked! Welcome back to Jungle Pals!');
    } else {
      // Open parent report & controls
      setParentZoneUnlocked(true);
      navigateTo(NAV_TABS.STICKERS, 'main');
      sounds.speak('Parent Zone unlocked!');
    }
  };

  const isLockedOut = isTimeLimitReached || kidLockActive;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.appContainer}>
        {/* Top App Header with Universal Back Button */}
        <Header
          subtitle={getSubtitle()}
          stars={stars}
          streak={streak}
          showBack={currentView !== 'main' || activeTab !== NAV_TABS.WORLD}
          onBack={handleBack}
          onProfilePress={() => {
            if (kidLockActive) {
              setGateAction('parent_zone');
              setParentGateVisible(true);
            } else {
              setParentZoneUnlocked(true);
              navigateTo(NAV_TABS.STICKERS, 'main');
            }
          }}
          companionEmoji={FAVORITE_ANIMALS[favoriteAnimal]?.avatar || '🐆'}
        />

        {/* Screen View Switcher */}
        <View style={styles.screenBody}>
          {currentView === 'word_builder' ? (
            <WordBuilderScreen
              onBack={handleBack}
              onAddStars={addStars}
              onTaskCompleted={() => handleTaskCompleted('words')}
            />
          ) : activeTab === NAV_TABS.WORLD ? (
            <WorldMapScreen
              onNavigateAlphabet={() => navigateTo(NAV_TABS.ALPHABET, 'main')}
              onNavigateNumbers={() => navigateTo(NAV_TABS.NUMBERS, 'main')}
              onNavigateWordBuilder={() => navigateTo(NAV_TABS.WORLD, 'word_builder')}
              onAddStars={addStars}
              isDailyQuestDone={dailyQuestDone}
            />
          ) : activeTab === NAV_TABS.ALPHABET ? (
            <AlphabetScreen
              onAddStars={addStars}
              savedLetter={lastAlphabet}
              onSelectLetter={handleAlphabetSelect}
              onTaskCompleted={() => handleTaskCompleted('alphabet')}
            />
          ) : activeTab === NAV_TABS.NUMBERS ? (
            <NumberScreen
              onAddStars={addStars}
              onTaskCompleted={() => handleTaskCompleted('numbers')}
            />
          ) : (
            <StickerAlbumScreen
              initialUnlocked={parentZoneUnlocked}
              onLockParentZone={() => setParentZoneUnlocked(false)}
              onNavigateAlphabet={() => navigateTo(NAV_TABS.ALPHABET, 'main')}
              onNavigateNumbers={() => navigateTo(NAV_TABS.NUMBERS, 'main')}
              onNavigateWordBuilder={() => navigateTo(NAV_TABS.WORLD, 'word_builder')}
              onAddStars={addStars}
              favoriteAnimal={favoriteAnimal}
              onSelectFavoriteAnimal={(id) => {
                setFavoriteAnimal(id);
                saveFavoriteAnimal(id);
              }}
            />
          )}
        </View>

        {/* Global Interactive Animal Footprint Ripple Overlay */}
        <FootprintOverlay favoriteAnimal={favoriteAnimal} />

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={currentView === 'word_builder' ? null : activeTab}
          onTabSelect={handleTabSelect}
        />

        {/* =========================================================================
            CHILD SAFE APP LOCK SCREEN OVERLAY
            Appears when kid-lock is engaged or daily screen time limit is reached.
            Only adults can unlock using 4-digit PIN or 3x3 pattern lock.
            ========================================================================= */}
        {isTimeLimitReached && (
          <View style={styles.kidLockOverlay}>
            <View style={styles.kidLockCard}>
              <Image source={{ uri: lionSleepingImg }} style={styles.lockLionImage} resizeMode="contain" />

              <View style={styles.lockTitleRow}>
                <Text style={styles.lockMoonEmoji}>🌙</Text>
                <Text style={styles.lockTitle}>Jungle Rest Time!</Text>
              </View>

              <Text style={styles.lockDescription}>
                Great learning session! The jungle pals are taking a cozy nap.
                Screen time limit of {screenLimit} minutes has been reached.
              </Text>

              <View style={styles.lockSessionPill}>
                <Text style={styles.lockSessionText}>⏱️ Used: {sessionMinutes}m / {screenLimit}m</Text>
              </View>

              <TouchableOpacity
                style={styles.grownUpUnlockBtn}
                activeOpacity={0.85}
                onPress={() => {
                  sounds.playTap();
                  setGateAction('unlock_kid_lock');
                  setParentGateVisible(true);
                }}
              >
                <Text style={styles.grownUpBtnEmoji}>🔑</Text>
                <Text style={styles.grownUpBtnText}>Grown-Up Unlock (PIN / Pattern)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Parent Security Gate Modal */}
        <ParentalGateModal
          visible={parentGateVisible}
          title="Parent Security Gate"
          subtitle="Enter your 4-digit PIN, 3x3 Pattern, or solve adult math to unlock:"
          onSuccess={handleGateSuccess}
          onClose={() => setParentGateVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: 500, // Child-tablet and mobile friendly frame
    backgroundColor: colors.surface,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  screenBody: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    backgroundColor: colors.surface,
    position: 'relative',
    overflow: 'hidden',
  },
  kidLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 9999,
  },
  kidLockCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  lockLionImage: {
    width: 140,
    height: 100,
    marginBottom: 4,
  },
  lockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockMoonEmoji: {
    fontSize: 24,
  },
  lockTitle: {
    ...typography.headlineMedium,
    color: '#1E293B',
    fontWeight: '900',
  },
  lockDescription: {
    ...typography.bodyMedium,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  lockSessionPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockSessionText: {
    ...typography.labelSmall,
    color: '#B45309',
    fontWeight: '800',
  },
  grownUpUnlockBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  grownUpBtnEmoji: {
    fontSize: 18,
  },
  grownUpBtnText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
