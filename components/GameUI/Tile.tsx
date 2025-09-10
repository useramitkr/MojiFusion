// Enhanced Tile.tsx with animations and special tiles
import { useGame } from "@/context/GameContext";
import { SPECIAL_TILES } from "@/game/engine";
import { themes } from "@/game/themes";
import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated 
} from "react-native";

type Props = { 
  value: number;
  row: number;
  col: number;
};

const { width } = Dimensions.get('window');
const TILE_SIZE = (width * 0.9) / 4 - 8;

// Enhanced tile styling with special tile support
const getTileStyle = (value: number) => {
  // Special tiles
  if (value === SPECIAL_TILES.BOMB) {
    return { bg: '#fcfa7aff', border: '#CC0000', emoji: true, special: 'bomb' };
  }
  if (value === SPECIAL_TILES.COIN) {
    return { bg: '#FFD700', border: '#FFA500', emoji: true, special: 'coin' };
  }
  if (value === SPECIAL_TILES.REWARD) {
    return { bg: '#9C27B0', border: '#7B1FA2', emoji: true, special: 'reward' };
  }

  // Regular tiles
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

// Get special tile emoji
const getSpecialEmoji = (value: number) => {
  switch (value) {
    case SPECIAL_TILES.BOMB: return '🔥';
    case SPECIAL_TILES.COIN: return '🪙';
    case SPECIAL_TILES.REWARD: return '🔑';
    default: return '';
  }
};

export default function Tile({ value, row, col }: Props) {
  const { theme, switchTile, switcherCount, playSound } = useGame();
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const [showBubble, setShowBubble] = useState(false);

  // Entrance animation for new tiles
  useEffect(() => {
    if (value !== 0) {
      scaleValue.setValue(0.8);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [value, scaleValue]);

  // Pulsing animation for special tiles
  useEffect(() => {
    if (value < 0) { // Special tiles have negative values
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [value, pulseValue]);

  // Merge animation (bubble effect)
  const triggerMergeAnimation = () => {
    setShowBubble(true);
    
    // Scale up bubble
    Animated.sequence([
      Animated.timing(bubbleScale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowBubble(false);
    });

    // Rotate tile
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Trigger merge animation when value increases significantly
  const previousValue = useRef(value);
  useEffect(() => {
    if (value > previousValue.current && previousValue.current > 0) {
      triggerMergeAnimation();
    }
    previousValue.current = value;
  }, [value]);

  if (value === 0) {
    return <View style={styles.empty} />;
  }

  const tileStyle = getTileStyle(value);
  const isSpecialTile = value < 0;
  const emoji = isSpecialTile ? getSpecialEmoji(value) : (themes[theme][value] || value);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      onPressIn={() => {
        setIsPressed(true);
        Animated.spring(scaleValue, {
          toValue: 0.95,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }).start();
      }}
      onPressOut={() => {
        setIsPressed(false);
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }).start();
      }}
      style={[
        styles.tileContainer,
        {
          backgroundColor: tileStyle.bg,
          borderColor: tileStyle.border,
        }
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.tileContent,
          {
            transform: [
              { scale: Animated.multiply(scaleValue, pulseValue) },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Text style={[
          styles.text, 
          { 
            fontSize: value >= 128 ? 28 : 36,
            textShadowColor: isSpecialTile ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)',
          }
        ]}>
          {emoji}
        </Text>
        
        {/* Special tile indicators */}
        {isSpecialTile && (
          <View style={styles.specialIndicator}>
            <Text style={styles.specialText}>✨</Text>
          </View>
        )}
        
        {/* Sparkle effect for higher values */}
        {value >= 256 && !isSpecialTile && (
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle}>✨</Text>
          </View>
        )}

        {/* Bubble animation overlay */}
        {showBubble && (
          <Animated.View
            style={[
              styles.bubbleOverlay,
              {
                transform: [{ scale: bubbleScale }],
              },
            ]}
          >
            <View style={styles.bubble} />
            <View style={[styles.bubble, styles.bubble2]} />
            <View style={[styles.bubble, styles.bubble3]} />
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    margin: 4,
    backgroundColor: 'rgba(246, 237, 237, 0.52)',
    borderRadius: 16,
    minHeight: TILE_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.47)',
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
    overflow: 'hidden',
  },
  tileContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  specialText: {
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
  bubbleOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  bubble2: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    top: -10,
    left: -15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bubble3: {
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 10,
    right: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});