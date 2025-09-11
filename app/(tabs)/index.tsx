// app/(tabs)/index.tsx - Updated with new features
import Header from "@/components/GameUI/Header";
import GameOverModal from "@/components/GameUI/GameOverModal";
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, ImageBackground, View, Animated, Easing, Dimensions, TouchableOpacity, Text } from "react-native";
import SwipeableBoard from "@/components/GameUI/SwipeableBoard";
import { useGame } from "@/context/GameContext";
import Tutorial from "@/components/GameUI/Tutorial";

const emojis = ['✨', '🌟', '💫', '💥', '✨', '⭐', '✨', '🌟', '💫', '💥', '✨', '⭐'];
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const AnimatedEmoji = ({ emoji, yRange } : any) => {
  const animatedX = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const animatedY = useRef(new Animated.Value(yRange[0] + Math.random() * (yRange[1] - yRange[0]))).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.timing(animatedY, {
          toValue: yRange[1] + 50,
          duration: 15000 + Math.random() * 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.Text style={[ styles.emoji, { transform: [{ translateX: animatedX }, { translateY: animatedY }] }]}>
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
    newGame,
    levelUp,
    nextLevel,
    level,
    resumeWithSwitcher,
  } = useGame();

  if (levelUp) {
    return (
        <View style={styles.levelUpContainer}>
             <ImageBackground source={require('@/assets/images/gamebg.png')} style={styles.backgroundImage}/>
            <Text style={styles.levelUpTitle}>Level {level} Cleared!</Text>
            <TouchableOpacity style={styles.nextLevelButton} onPress={nextLevel}>
                <Text style={styles.nextLevelButtonText}>Start Level {level + 1}</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/gamebg.png')} style={styles.backgroundImage}/>
      {emojis.map((emoji, index) => (<AnimatedEmoji key={index} emoji={emoji} yRange={[-50, screenHeight]}/>))}
      <Header />
      <SwipeableBoard />
      <Tutorial visible={showTutorial} onComplete={dismissTutorial}/>
      <GameOverModal 
        visible={isGameOver} 
        onRestart={restartGame} 
        onNewGame={newGame}
        onResumeWithSwitcher={resumeWithSwitcher}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  emoji: { position: 'absolute', fontSize: 30, zIndex: 0, opacity: 0.5 },
  levelUpContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  levelUpTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  nextLevelButton: { backgroundColor: '#FF6B35', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15 },
  nextLevelButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
