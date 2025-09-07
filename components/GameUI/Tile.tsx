// file: components/GameUI/getTileStyle.tsx
import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Vibration } from "react-native";

type Props = { 
  value: number;
  row: number;
  col: number;
};

const { width } = Dimensions.get('window');
const TILE_SIZE = (width * 0.9) / 4 - 8;

// Bright, kid-friendly colors
const getTileStyle = (value: number) => {
  const styles = {
    2: { bg: '#FFE4E1', border: '#FFB6C1', emoji: true },
    4: { bg: '#FFFACD', border: '#FFD700', emoji: true },
    8: { bg: '#E6E6FA', border: '#9370DB', emoji: true },
    16: { bg: '#FFE4B5', border: '#FF8C00', emoji: true },
    32: { bg: '#F0FFF0', border: '#32CD32', emoji: true },
    64: { bg: '#FFF8DC', border: '#DAA520', emoji: true },
    128: { bg: '#FFB6C1', border: '#FF1493', emoji: true },
    256: { bg: '#AFEEEE', border: '#00CED1', emoji: true },
    512: { bg: '#DDA0DD', border: '#9932CC', emoji: true },
    1024: { bg: '#F0E68C', border: '#FFD700', emoji: true },
    2048: { bg: '#FF69B4', border: '#FF1493', emoji: true },
  };
  
  return styles[value as keyof typeof styles] || { bg: '#F5F5DC', border: '#D3D3D3', emoji: false };
};

export default function Tile({ value, row, col }: Props) {
  const { theme, switchTile, switcherCount, playSound } = useGame();
  const [isPressed, setIsPressed] = useState(false);
  
  if (value === 0) {
    return <View style={styles.empty} />;
  }

  const emoji = themes[theme][value] || value;
  const tileStyle = getTileStyle(value);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.tileContainer,
        {
          backgroundColor: tileStyle.bg,
          borderColor: tileStyle.border,
          transform: [{ scale: isPressed ? 0.95 : 1 }],
        }
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { fontSize: value >= 128 ? 28 : 36 }]}>
        {emoji}
      </Text>
      
      {/* Sparkle effect for higher values */}
      {value >= 256 && (
        <View style={styles.sparkleContainer}>
          <Text style={styles.sparkle}>笨ｨ</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    margin: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    minHeight: TILE_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  tileContainer: {
    flex: 1,
    margin: 4,
    minHeight: TILE_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: 'relative',
  },
  text: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  switcherHint: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  hintText: {
    fontSize: 10,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
  sparkle: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switcherModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    maxWidth: width * 0.9,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#FF6B35',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emojiList: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  emojiOption: {
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 16,
    borderWidth: 2,
    minWidth: 70,
  },
  currentEmoji: {
    borderWidth: 4,
    borderColor: '#FF6B35',
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 32,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});