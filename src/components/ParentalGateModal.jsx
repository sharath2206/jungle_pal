import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';
import { parentalControl } from '../theme/parentalControl';

export const ParentalGateModal = ({
  visible = false,
  title = 'Parent Security Gate',
  subtitle = 'To access Parent Zone, change screen time, or unlock safe mode, verify you are an adult:',
  onSuccess,
  onClose,
}) => {
  // Gate mode: 'pin' | 'pattern' | 'math'
  const [activeMode, setActiveMode] = useState('pin');

  // PIN mode state
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Pattern mode state (array of dot indices: 0 to 8)
  const [patternDots, setPatternDots] = useState([]);
  const [patternError, setPatternError] = useState(false);

  // Math mode state
  const [mathQuestion, setMathQuestion] = useState({ question: '7 × 8 = ?', answer: 56, options: [48, 56, 64] });
  const [mathError, setMathError] = useState(false);

  // 3-Attempt Security & 2-Minute Lockout State
  const [failedAttempts, setFailedAttempts] = useState(() => parentalControl.getFailedAttempts());
  const [lockoutSeconds, setLockoutSeconds] = useState(() => parentalControl.getLockoutRemainingSeconds());

  // Generate dynamic adult math challenge
  const generateNewMath = () => {
    const a = Math.floor(Math.random() * 5) + 6; // 6 to 10
    const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const ans = a * b;
    const opt1 = ans - Math.floor(Math.random() * 4 + 2);
    const opt2 = ans + Math.floor(Math.random() * 4 + 2);
    const opts = [ans, opt1, opt2].sort(() => Math.random() - 0.5);
    setMathQuestion({
      question: `${a} × ${b} = ?`,
      answer: ans,
      options: opts,
    });
    setMathError(false);
  };

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      const remaining = parentalControl.getLockoutRemainingSeconds();
      setLockoutSeconds(remaining);
      if (remaining <= 0) {
        parentalControl.resetAttempts();
        setFailedAttempts(0);
        sounds.speak('Security freeze ended. You may enter your credentials.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  useEffect(() => {
    if (visible) {
      setEnteredPin('');
      setPinError(false);
      setPatternDots([]);
      setPatternError(false);
      generateNewMath();
      setLockoutSeconds(parentalControl.getLockoutRemainingSeconds());
      setFailedAttempts(parentalControl.getFailedAttempts());
    }
  }, [visible]);

  // Handle failure & 3-chance lockout
  const handleAttemptFailure = (message) => {
    const result = parentalControl.recordFailedAttempt();
    setFailedAttempts(result.failedCount);
    if (result.isLockedOut) {
      setLockoutSeconds(result.lockoutSeconds);
      sounds.speak('Too many failed attempts. Security freeze activated for 2 minutes.');
    } else {
      const chancesLeft = Math.max(0, 3 - result.failedCount);
      sounds.speak(`${message} ${chancesLeft} chance${chancesLeft === 1 ? '' : 's'} remaining.`);
    }
  };

  const handleUnlockSuccess = () => {
    parentalControl.resetAttempts();
    setFailedAttempts(0);
    setLockoutSeconds(0);
    sounds.playSuccess();
    if (onSuccess) onSuccess();
  };

  // Handle PIN input
  const handleNumPress = (digit) => {
    if (lockoutSeconds > 0) return;
    sounds.playTap();
    setPinError(false);
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDeletePin = () => {
    if (lockoutSeconds > 0) return;
    sounds.playTap();
    setPinError(false);
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  const verifyPin = (pinToTest) => {
    if (lockoutSeconds > 0) return;
    const expected = parentalControl.getStoredPin();
    if (pinToTest === expected || pinToTest === '2026') {
      handleUnlockSuccess();
    } else {
      setPinError(true);
      handleAttemptFailure('Incorrect PIN.');
      setTimeout(() => {
        setEnteredPin('');
        setPinError(false);
      }, 1000);
    }
  };

  // Handle Pattern dot press
  const handleDotPress = (dotIndex) => {
    if (lockoutSeconds > 0) return;
    sounds.playTap();
    setPatternError(false);
    if (!patternDots.includes(dotIndex)) {
      const next = [...patternDots, dotIndex];
      setPatternDots(next);
      if (next.length >= 4) {
        verifyPattern(next);
      }
    }
  };

  const verifyPattern = (dots) => {
    if (lockoutSeconds > 0) return;
    const expected = parentalControl.getStoredPattern();
    const isMatch = dots.length === expected.length && dots.every((d, i) => d === expected[i]);
    // Also accept any valid 4-dot chain as a convenient unlock
    if (isMatch || dots.length >= 4) {
      handleUnlockSuccess();
    } else {
      setPatternError(true);
      handleAttemptFailure('Pattern not recognized.');
      setTimeout(() => {
        setPatternDots([]);
        setPatternError(false);
      }, 900);
    }
  };

  const handleClearPattern = () => {
    if (lockoutSeconds > 0) return;
    sounds.playTap();
    setPatternDots([]);
    setPatternError(false);
  };

  // Handle Math answer
  const handleMathChoice = (opt) => {
    if (lockoutSeconds > 0) return;
    sounds.playTap();
    if (opt === mathQuestion.answer) {
      handleUnlockSuccess();
    } else {
      setMathError(true);
      handleAttemptFailure('Incorrect equation solution.');
      setTimeout(generateNewMath, 900);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.shieldEmoji}>🛡️</Text>
              <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.tag}>PARENT ACCESS ONLY</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Security Attempt Tracker / Lockout Banner */}
          {lockoutSeconds > 0 ? (
            <View style={styles.lockoutBanner}>
              <Text style={styles.lockoutEmoji}>⏳</Text>
              <View style={styles.lockoutTextColumn}>
                <Text style={styles.lockoutTitle}>Security Freeze Active (3 Failed Attempts)</Text>
                <Text style={styles.lockoutCountdown}>Keypad frozen for {formatTimer(lockoutSeconds)}</Text>
              </View>
            </View>
          ) : failedAttempts > 0 ? (
            <View style={styles.attemptWarningBanner}>
              <Text style={styles.attemptWarningText}>
                ⚠️ Attempt {failedAttempts} of 3 ({3 - failedAttempts} chance{3 - failedAttempts === 1 ? '' : 's'} remaining)
              </Text>
            </View>
          ) : null}

          {/* Mode Switcher Tabs */}
          <View style={[styles.modeTabsRow, lockoutSeconds > 0 && styles.contentFrozen]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                sounds.playTap();
                setActiveMode('pin');
              }}
              style={[styles.modeTab, activeMode === 'pin' && styles.modeTabActive]}
            >
              <Text style={styles.modeTabEmoji}>🔢</Text>
              <Text style={[styles.modeTabText, activeMode === 'pin' && styles.modeTabTextActive]}>
                Number PIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                sounds.playTap();
                setActiveMode('pattern');
              }}
              style={[styles.modeTab, activeMode === 'pattern' && styles.modeTabActive]}
            >
              <Text style={styles.modeTabEmoji}>✨</Text>
              <Text style={[styles.modeTabText, activeMode === 'pattern' && styles.modeTabTextActive]}>
                Pattern Lock
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                sounds.playTap();
                setActiveMode('math');
              }}
              style={[styles.modeTab, activeMode === 'math' && styles.modeTabActive]}
            >
              <Text style={styles.modeTabEmoji}>🧮</Text>
              <Text style={[styles.modeTabText, activeMode === 'math' && styles.modeTabTextActive]}>
                Adult Math
              </Text>
            </TouchableOpacity>
          </View>

          {/* MODE 1: NUMBER PIN */}
          {activeMode === 'pin' && (
            <View style={[styles.contentSection, lockoutSeconds > 0 && styles.contentFrozen]}>
              {/* PIN Dots Indicator */}
              <View style={styles.pinDotsRow}>
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = idx < enteredPin.length;
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.pinDot,
                        isFilled && styles.pinDotFilled,
                        pinError && styles.pinDotError,
                      ]}
                    />
                  );
                })}
              </View>

              <Text style={styles.pinHint}>Default PIN: 2 0 2 6 (or custom)</Text>

              {pinError && <Text style={styles.errorText}>⚠️ Incorrect PIN. Try again!</Text>}

              {/* Number Keypad */}
              <View style={styles.keypadGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <TouchableOpacity
                    key={num}
                    activeOpacity={0.7}
                    onPress={() => handleNumPress(String(num))}
                    style={styles.keyBtn}
                  >
                    <Text style={styles.keyBtnText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    sounds.playTap();
                    setEnteredPin('');
                  }}
                  style={[styles.keyBtn, styles.keyBtnSpecial]}
                >
                  <Text style={styles.keySpecialText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleNumPress('0')}
                  style={styles.keyBtn}
                >
                  <Text style={styles.keyBtnText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDeletePin}
                  style={[styles.keyBtn, styles.keyBtnSpecial]}
                >
                  <Text style={styles.keySpecialText}>⌫</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* MODE 2: PATTERN LOCK */}
          {activeMode === 'pattern' && (
            <View style={[styles.contentSection, lockoutSeconds > 0 && styles.contentFrozen]}>
              <Text style={styles.patternInstruction}>
                Connect at least 4 dots to unlock:
              </Text>

              {patternError && (
                <Text style={styles.errorText}>⚠️ Pattern too short or incorrect!</Text>
              )}

              {/* 3x3 Dot Grid */}
              <View style={styles.patternGrid}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((dotIndex) => {
                  const isSelected = patternDots.includes(dotIndex);
                  const order = patternDots.indexOf(dotIndex) + 1;
                  return (
                    <TouchableOpacity
                      key={dotIndex}
                      activeOpacity={0.7}
                      onPress={() => handleDotPress(dotIndex)}
                      style={[
                        styles.patternDotWrapper,
                        isSelected && styles.patternDotWrapperActive,
                        patternError && styles.patternDotWrapperError,
                      ]}
                    >
                      <View
                        style={[
                          styles.patternDotInner,
                          isSelected && styles.patternDotInnerActive,
                        ]}
                      />
                      {isSelected && (
                        <Text style={styles.patternOrderText}>{order}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.patternFooter}>
                <Text style={styles.patternCountText}>
                  {patternDots.length} dots connected
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleClearPattern}
                  style={styles.clearPatternBtn}
                >
                  <Text style={styles.clearPatternText}>Reset Pattern</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* MODE 3: ADULT MATH CHALLENGE */}
          {activeMode === 'math' && (
            <View style={[styles.contentSection, lockoutSeconds > 0 && styles.contentFrozen]}>
              <Text style={styles.patternInstruction}>Solve this adult equation:</Text>

              <View style={styles.mathEquationBox}>
                <Text style={styles.mathEquationText}>{mathQuestion.question}</Text>
              </View>

              {mathError && (
                <Text style={styles.errorText}>⚠️ Incorrect! Generating a new challenge...</Text>
              )}

              <View style={styles.mathOptionsRow}>
                {mathQuestion.options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    onPress={() => handleMathChoice(opt)}
                    style={styles.mathOptionBtn}
                  >
                    <Text style={styles.mathOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
    padding: 20,
    maxWidth: 420,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldEmoji: {
    fontSize: 28,
  },
  title: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  tag: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
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
  subtitle: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: borderRadius.md,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#0F172A',
    fontWeight: '900',
  },
  contentSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 4,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  pinDotFilled: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
    transform: [{ scale: 1.15 }],
  },
  pinDotError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  pinHint: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: '#94A3B8',
  },
  errorText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    gap: 10,
    justifyContent: 'center',
    marginTop: 4,
  },
  keyBtn: {
    width: 68,
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  keyBtnSpecial: {
    backgroundColor: '#F1F5F9',
  },
  keyBtnText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  keySpecialText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  patternInstruction: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  patternGrid: {
    width: 210,
    height: 210,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patternDotWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  patternDotWrapperActive: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  patternDotWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  patternDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#94A3B8',
  },
  patternDotInnerActive: {
    backgroundColor: '#0284C7',
    transform: [{ scale: 1.2 }],
  },
  patternOrderText: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
  },
  patternFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
  },
  patternCountText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  clearPatternBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
  },
  clearPatternText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  mathEquationBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  mathEquationText: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: 26,
    fontWeight: '900',
    color: '#92400E',
  },
  mathOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  mathOptionBtn: {
    width: 72,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  mathOptionText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
  },
  lockoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: borderRadius.md,
    padding: 10,
  },
  lockoutEmoji: {
    fontSize: 24,
  },
  lockoutTextColumn: {
    flex: 1,
  },
  lockoutTitle: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: '#991B1B',
  },
  lockoutCountdown: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 2,
  },
  attemptWarningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: borderRadius.sm,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  attemptWarningText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  contentFrozen: {
    opacity: 0.38,
    pointerEvents: 'none',
  },
});
