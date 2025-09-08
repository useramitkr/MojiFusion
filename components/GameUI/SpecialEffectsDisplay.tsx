// components/GameUI/SpecialEffectsDisplay.tsx
import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Dimensions 
} from "react-native";
import { SPECIAL_TILES } from "@/game/engine";

const { width, height } = Dimensions.get('window');

type SpecialEffect = {
  id: string;
  type: 'coin_merge' | 'reward_merge' | 'coin_reward_merge' | 'bomb_explosion';
  position: { x: number; y: number };
  message: string;
  emoji: string;
  timestamp: number;
};

type Props = {
  effects: SpecialEffect[];
  onEffectComplete: (id: string) => void;
};

const SpecialEffectItem = ({ effect, onComplete }: { effect: SpecialEffect; onComplete: () => void }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.2,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.delay(1500), // Show for 1.5 seconds
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, []);

  const getEffectStyle = () => {
    switch (effect.type) {
      case 'coin_merge':
        return { backgroundColor: '#FFD700', borderColor: '#FFA500' };
      case 'reward_merge':
        return { backgroundColor: '#9C27B0', borderColor: '#7B1FA2' };
      case 'coin_reward_merge':
        return { backgroundColor: '#FF6B35', borderColor: '#E55A2B' };
      case 'bomb_explosion':
        return { backgroundColor: '#FF4444', borderColor: '#CC0000' };
      default:
        return { backgroundColor: '#4CAF50', borderColor: '#45A049' };
    }
  };

  return (
    <Animated.View
      style={[
        styles.effectContainer,
        getEffectStyle(),
        {
          left: effect.position.x,
          top: effect.position.y,
          opacity: opacityValue,
          transform: [
            { scale: scaleValue },
            { translateY: translateY },
          ],
        },
      ]}
    >
      <Text style={styles.effectEmoji}>{effect.emoji}</Text>
      <Text style={styles.effectMessage}>{effect.message}</Text>
    </Animated.View>
  );
};

export default function SpecialEffectsDisplay({ effects, onEffectComplete }: Props) {
  return (
    <View style={styles.container} pointerEvents="none">
      {effects.map((effect) => (
        <SpecialEffectItem
          key={effect.id}
          effect={effect}
          onComplete={() => onEffectComplete(effect.id)}
        />
      ))}
    </View>
  );
}

// Helper function to create special effects
export const createSpecialEffect = (
  type: SpecialEffect['type'],
  position: { x: number; y: number },
  customMessage?: string
): SpecialEffect => {
  const effects = {
    coin_merge: {
      emoji: '🪙✨',
      message: customMessage || 'Coin Combo!',
    },
    reward_merge: {
      emoji: '🎁🌟',
      message: customMessage || 'Gift Combo!',
    },
    coin_reward_merge: {
      emoji: '🪙🎁',
      message: customMessage || 'Super Combo!',
    },
    bomb_explosion: {
      emoji: '💥💣',
      message: customMessage || 'BOOM!',
    },
  };

  return {
    id: `effect_${Date.now()}_${Math.random()}`,
    type,
    position,
    message: effects[type].message,
    emoji: effects[type].emoji,
    timestamp: Date.now(),
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  effectContainer: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 120,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  effectEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  effectMessage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});