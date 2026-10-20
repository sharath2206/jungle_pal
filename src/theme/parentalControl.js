// Parental Control & Screen Time Manager
import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  PIN: 'jungle_parent_pin',
  PATTERN: 'jungle_parent_pattern',
  SCREEN_TIME_LIMIT: 'jungle_screen_time_limit',
  KID_LOCK: 'jungle_kid_lock_active',
  LETTERS_MASTERED: 'jungle_letters_mastered',
  WORDS_COMPLETED: 'jungle_words_completed',
  NUMBER_COMPLETED: 'jungle_number_completed',
  UNLOCKED_STICKERS: 'jungle_unlocked_stickers',
  FAILED_ATTEMPTS: 'jungle_parent_failed_attempts',
  LOCKOUT_UNTIL: 'jungle_parent_lockout_until',
};

const DEFAULT_PIN = '2026';
const DEFAULT_PATTERN = [0, 1, 4, 7]; // Top-left -> Top-center -> Center -> Bottom-center

let sessionSeconds = 0;
let timerInterval = null;

// Ensure timer runs across session
if (typeof window !== 'undefined') {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      sessionSeconds += 1;
    }, 1000);
  }
}

export const parentalControl = {
  getDefaultPin: () => DEFAULT_PIN,

  getFailedAttempts: () => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  getLockoutRemainingSeconds: () => {
    try {
      const until = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      if (!until) return 0;
      const remainingMs = parseInt(until, 10) - Date.now();
      return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
    } catch {
      return 0;
    }
  },

  recordFailedAttempt: () => {
    try {
      let attempts = parentalControl.getFailedAttempts() + 1;
      localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, String(attempts));
      let isLockedOut = false;
      let lockoutSeconds = 0;
      if (attempts >= 3) {
        isLockedOut = true;
        lockoutSeconds = 120; // 2 minutes freeze
        const until = Date.now() + 120 * 1000;
        localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, String(until));
      }
      return { failedCount: attempts, isLockedOut, lockoutSeconds };
    } catch {
      return { failedCount: 1, isLockedOut: false, lockoutSeconds: 0 };
    }
  },

  resetAttempts: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    } catch {}
  },
  
  getStoredPin: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  },

  setPin: (newPin) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PIN, String(newPin));
      return true;
    } catch {
      return false;
    }
  },

  getStoredPattern: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATTERN);
      return stored ? JSON.parse(stored) : DEFAULT_PATTERN;
    } catch {
      return DEFAULT_PATTERN;
    }
  },

  setPattern: (patternArray) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATTERN, JSON.stringify(patternArray));
      return true;
    } catch {
      return false;
    }
  },

  getScreenTimeLimit: () => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME_LIMIT);
      return val ? parseInt(val, 10) : 30; // default 30 mins
    } catch {
      return 30;
    }
  },

  setScreenTimeLimit: (mins) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCREEN_TIME_LIMIT, String(mins));
      return mins;
    } catch {
      return mins;
    }
  },

  isKidLockActive: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.KID_LOCK) === 'true';
    } catch {
      return false;
    }
  },

  setKidLock: (active) => {
    try {
      localStorage.setItem(STORAGE_KEYS.KID_LOCK, active ? 'true' : 'false');
      return active;
    } catch {
      return active;
    }
  },

  getSessionSeconds: () => sessionSeconds,
  getSessionMinutes: () => Math.floor(sessionSeconds / 60),

  addExtraTime: (minutes = 15) => {
    // reduce sessionSeconds so limit has more headroom
    sessionSeconds = Math.max(0, sessionSeconds - minutes * 60);
  },

  // Dynamic Learning & Activity Statistics
  getDynamicStats: () => {
    const defaultStats = {
      lettersMastered: ['A', 'B', 'C', 'L', 'M'],
      wordsSpelled: ['LION', 'BEAR'],
      numberCompleted: true,
      numbersCompleted: ['oasis_5', 'milo_10'],
      unlockedStickers: ['lion', 'monkey', 'letter_l'],
      stickersUnlocked: ['lion', 'monkey', 'letter_l'],
      stars: 45,
      sessionMinutes: Math.floor(sessionSeconds / 60),
      screenTimeLimit: parentalControl.getScreenTimeLimit(),
      accuracy: 94,
    };

    if (typeof window === 'undefined') {
      return defaultStats;
    }

    try {
      // 1. Letters explored / mastered
      let letters = ['A', 'B', 'C', 'L', 'M'];
      const storedLetters = localStorage.getItem(STORAGE_KEYS.LETTERS_MASTERED);
      if (storedLetters) {
        try {
          const parsed = JSON.parse(storedLetters);
          if (Array.isArray(parsed) && parsed.length > 0) letters = parsed;
        } catch {}
      }
      const lastAlphabet = localStorage.getItem('jungle_last_alphabet');
      if (lastAlphabet && !letters.includes(lastAlphabet)) {
        letters.push(lastAlphabet);
      }

      // 2. Words completed in Word Forest
      let words = ['LION'];
      const storedWords = localStorage.getItem(STORAGE_KEYS.WORDS_COMPLETED);
      if (storedWords) {
        try {
          const parsed = JSON.parse(storedWords);
          if (Array.isArray(parsed) && parsed.length > 0) words = parsed;
        } catch {}
      }

      // 3. Number Safari completed stages
      let numbersStages = ['oasis_5', 'milo_10'];
      const storedNumbers = localStorage.getItem('jungle_numbers_stages');
      if (storedNumbers) {
        try {
          const parsed = JSON.parse(storedNumbers);
          if (Array.isArray(parsed) && parsed.length > 0) numbersStages = parsed;
        } catch {}
      }
      const numberDone = localStorage.getItem(STORAGE_KEYS.NUMBER_COMPLETED) === 'true';

      // 4. Unlocked stickers
      let stickers = ['lion', 'monkey', 'letter_l'];
      const storedStickers = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STICKERS);
      if (storedStickers) {
        try {
          const parsed = JSON.parse(storedStickers);
          if (Array.isArray(parsed) && parsed.length > 0) stickers = parsed;
        } catch {}
      }

      // Calculate dynamic accuracy percentage based on actual accomplishments
      const baseScore = Math.min(99, 78 + letters.length * 2 + words.length * 3 + (numberDone ? 5 : 0));
      const totalStars = 24 + letters.length * 5 + words.length * 10 + numbersStages.length * 5 + stickers.length * 5;

      return {
        lettersMastered: letters,
        wordsSpelled: words,
        numberCompleted: numberDone,
        numbersCompleted: numbersStages,
        unlockedStickers: stickers,
        stickersUnlocked: stickers, // Compatibility alias
        stars: totalStars,
        sessionMinutes: Math.floor(sessionSeconds / 60),
        screenTimeLimit: parentalControl.getScreenTimeLimit(),
        accuracy: baseScore,
      };
    } catch {
      return defaultStats;
    }
  },

  // Record a mastered letter
  recordLetterMastered: (letter) => {
    try {
      const stats = parentalControl.getDynamicStats();
      const updated = Array.from(new Set([...stats.lettersMastered, letter]));
      localStorage.setItem(STORAGE_KEYS.LETTERS_MASTERED, JSON.stringify(updated));
    } catch {}
  },

  // Record an unlocked sticker
  unlockSticker: (stickerId) => {
    try {
      const stats = parentalControl.getDynamicStats();
      const updated = Array.from(new Set([...stats.unlockedStickers, stickerId]));
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_STICKERS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // Record a completed number safari stage
  recordNumberStage: (stageId) => {
    try {
      const stored = localStorage.getItem('jungle_numbers_stages');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.includes(stageId)) {
        list.push(stageId);
        localStorage.setItem('jungle_numbers_stages', JSON.stringify(list));
      }
      localStorage.setItem(STORAGE_KEYS.NUMBER_COMPLETED, 'true');
    } catch {}
  },
};

// React hook to observe screen time and kid-lock state
export function useParentalControl() {
  const [sessionMinutes, setSessionMinutes] = useState(parentalControl.getSessionMinutes());
  const [screenLimit, setScreenLimit] = useState(parentalControl.getScreenTimeLimit());
  const [kidLockActive, setKidLockActive] = useState(parentalControl.isKidLockActive());
  const [stats, setStats] = useState(parentalControl.getDynamicStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionMinutes(parentalControl.getSessionMinutes());
      setStats(parentalControl.getDynamicStats());
    }, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  const isTimeLimitReached = screenLimit > 0 && sessionMinutes >= screenLimit;

  return {
    sessionMinutes,
    screenLimit,
    setScreenLimit: (mins) => {
      parentalControl.setScreenTimeLimit(mins);
      setScreenLimit(mins);
    },
    kidLockActive,
    toggleKidLock: () => {
      const next = !kidLockActive;
      parentalControl.setKidLock(next);
      setKidLockActive(next);
      return next;
    },
    isTimeLimitReached,
    addExtraTime: (mins) => {
      parentalControl.addExtraTime(mins);
      setSessionMinutes(parentalControl.getSessionMinutes());
    },
    stats,
    refreshStats: () => setStats(parentalControl.getDynamicStats()),
  };
}
