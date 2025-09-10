// app/(tabs)/index.tsx - Updated with new features
import Header from "@/components/GameUI/Header";
import GameOverModal from "@/components/GameUI/GameOverModal";
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, ImageBackground, View, Animated, Easing, Dimensions } from "react-native";
import SwipeableBoard from "@/components/GameUI/SwipeableBoard";
import { useGame } from "@/context/GameContext";
import Tutorial from "@/components/GameUI/Tutorial";

// A list of random emojis to display
const emojis = ['✨', '🌟', '💫', '💥', '✨', '⭐', '✨', '🌟', '💫', '💥', '✨', '⭐'];
const totalEmojis = emojis.length;
const topEmojisCount = 5;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const AnimatedEmoji = ({ emoji, yRange }) => {
  const animatedX = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const animatedY = useRef(new Animated.Value(yRange[0] + Math.random() * (yRange[1] - yRange[0]))).current;
  const animatedRotation = useRef(new Animated.Value(Math.random() * 360)).current;

  // Use state to trigger new animations
  const [target, setTarget] = useState({
    x: Math.random() * screenWidth,
    y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
    rotation: Math.random() * 360
  });

  useEffect(() => {
    // Start animation to new target
    Animated.parallel([
      Animated.timing(animatedX, {
        toValue: target.x,
        duration: 15000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedY, {
        toValue: target.y,
        duration: 15000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedRotation, {
        toValue: target.rotation,
        duration: 15000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Once animation is complete, set a new random target
      setTarget({
        x: Math.random() * screenWidth,
        y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
        rotation: Math.random() * 360
      });
    });

    // Cleanup function to stop animation if component unmounts
    return () => animatedX.stopAnimation();

  }, [target]); // Rerun effect whenever the target changes

  return (
    <Animated.Text
      style={[
        styles.emoji,
        {
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            {
              rotate: animatedRotation.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

export default function HomeScreen() {
  const {
    showTutorial,
    isGameOver,
    dismissTutorial,
    restartGame,
    newGame
  } = useGame();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/gamebg.png')}
        style={styles.backgroundImage}
      />

      {/* Render the animated emojis */}
      {emojis.map((emoji, index) => (
        <AnimatedEmoji
          key={index}
          emoji={emoji}
          yRange={index < topEmojisCount ? [0, screenHeight * 0.5] : [screenHeight * 0.5, screenHeight]}
        />
      ))}

      {/* Main game content */}
      <Header />
      <SwipeableBoard />

      {/* Tutorial Modal */}
      <Tutorial
        visible={showTutorial}
        onComplete={dismissTutorial}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={isGameOver}
        onRestart={restartGame}
        onNewGame={newGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  emoji: {
    position: 'absolute',
    fontSize: 30,
    zIndex: 0,
    opacity: 0.5,
  },
});
