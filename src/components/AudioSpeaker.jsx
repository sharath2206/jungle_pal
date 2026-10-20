import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds, useSoundMute } from '../theme/sounds';

export const AudioSpeaker = ({
  textToSpeak,
  label = 'Hear Sound',
  size = 'md', // 'sm', 'md', 'lg'
  style = {},
  variant = 'tertiary',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isMuted, toggleMute } = useSoundMute();

  const handlePress = () => {
    if (isMuted) {
      toggleMute();
      setTimeout(() => {
        sounds.playTap();
        setIsPlaying(true);
        if (textToSpeak) {
          sounds.speak(textToSpeak);
        }
        setTimeout(() => setIsPlaying(false), 1200);
      }, 50);
      return;
    }

    sounds.playTap();
    setIsPlaying(true);
    if (textToSpeak) {
      sounds.speak(textToSpeak);
    }
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[
        styles.speakerBtn,
        {
          backgroundColor: isMuted
            ? '#9CA3AF'
            : variant === 'secondary'
            ? colors.secondaryContainer
            : colors.tertiaryContainer,
          borderBottomColor: isMuted
            ? '#6B7280'
            : variant === 'secondary'
            ? colors.secondaryDark
            : colors.tertiaryDark,
          height: isLarge ? 64 : isSmall ? 44 : 52,
          paddingHorizontal: isLarge ? 20 : isSmall ? 12 : 16,
          transform: [{ scale: isPlaying ? 1.05 : 1 }],
        },
        style,
      ]}
    >
      <Text style={[styles.speakerIcon, { fontSize: isLarge ? 26 : isSmall ? 18 : 22 }]}>
        {isMuted ? '🔇' : isPlaying ? '🔊' : '🔉'}
      </Text>
      {label ? (
        <Text
          style={[
            styles.speakerLabel,
            {
              fontSize: isLarge ? 17 : isSmall ? 12 : 14,
            },
          ]}
        >
          {isMuted ? 'Unmute & Play' : label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  speakerBtn: {
    borderRadius: borderRadius.full,
    borderBottomWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    shadowColor: '#00668A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  speakerIcon: {
    color: '#FFFFFF',
  },
  speakerLabel: {
    fontFamily: typography.labelMd.fontFamily,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
