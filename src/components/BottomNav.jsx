import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Compass, BookA, Hash, Award } from 'lucide-react';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';

export const NAV_TABS = {
  WORLD: 'world',
  ALPHABET: 'alphabet',
  NUMBERS: 'numbers',
  STICKERS: 'stickers',
};

export const BottomNav = ({ activeTab, onTabSelect }) => {
  const tabs = [
    { id: NAV_TABS.WORLD, label: 'World', Icon: Compass },
    { id: NAV_TABS.ALPHABET, label: 'Alphabet', Icon: BookA },
    { id: NAV_TABS.NUMBERS, label: 'Numbers', Icon: Hash },
    { id: NAV_TABS.STICKERS, label: 'Stickers', Icon: Award },
  ];

  const handleTabPress = (tabId) => {
    sounds.playTap();
    if (onTabSelect) {
      onTabSelect(tabId);
    }
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.Icon;

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => handleTabPress(tab.id)}
              style={[
                styles.tabItem,
                isActive ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <IconComponent
                  size={22}
                  color={isActive ? '#FFFFFF' : colors.onSurfaceVariant}
                  strokeWidth={isActive ? 2.6 : 2.2}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#FFFFFF' : colors.onSurfaceVariant,
                    fontWeight: isActive ? '900' : '700',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    backgroundColor: '#FFF8F6',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(120, 53, 15, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 480,
    marginHorizontal: 'auto',
  },
  tabItem: {
    flex: 1,
    maxWidth: 96,
    minHeight: 54,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    gap: 3,
  },
  activeTab: {
    backgroundColor: colors.primaryContainer,
    borderBottomWidth: 4,
    borderBottomColor: colors.primaryDark,
    transform: [{ translateY: -2 }],
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
