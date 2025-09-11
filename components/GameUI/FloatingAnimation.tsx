import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const FloatingAnimation = ({
  type,
  amount,
  startPosition,
  onComplete,
}: {
  type: 'key' | 'coin' | 'fire';
  amount?: number;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: -100, // Fly up
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete());
  }, [opacity, translateY, onComplete]);

  const getEmoji = () => {
    switch (type) {
      case 'key':
        return '🔑';
      case 'coin':
        return `🪙`;
      case 'fire':
        return '🔥';
      default:
        return '';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: startPosition.x,
          top: startPosition.y,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.emoji}>{getEmoji()}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  emoji: {
    fontSize: 40,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default FloatingAnimation;

