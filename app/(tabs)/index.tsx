import Header from "@/components/GameUI/Header";
import GameOverModal from "@/components/GameUI/GameOverModal";
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Easing, Dimensions, TouchableOpacity, Text } from "react-native";
import SwipeableBoard from "@/components/GameUI/SwipeableBoard";
import { useGame } from "@/context/GameContext";
import Tutorial from "@/components/GameUI/Tutorial";
import { AVAILABLE_BACKGROUNDS, BACKGROUND_CONFIG, getRandomBackgroundIndex } from "@/utils/backgroundManager";
import InlineAd from "@/components/AdmobAd/InlineAd";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// This is the component for a single animated emoji
const AnimatedEmoji = ({ emoji, yRange }: { emoji: string; yRange: number[] }) => {
  const animatedX = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const animatedY = useRef(new Animated.Value(yRange[0] + Math.random() * (yRange[1] - yRange[0]))).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedY, {
        toValue: yRange[1] + 50,
        duration: 15000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedY, yRange]);

  return (
    <Animated.Text style={[styles.emoji, { transform: [{ translateX: animatedX }, { translateY: animatedY }] }]}>
      {emoji}
    </Animated.Text>
  );
};

// This is the pool of all possible emojis that can float
const EMOJI_POOL = ['✨', '🌟', '💫', '💥', '💖', '🚀', '🎉', '🔥', '💎', '🦄', '🌈', '⭐'];

// This function selects a random number of emojis from the pool
const getRandomEmojis = (pool: string[], min: number, max: number) => {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [nextBgIndex, setNextBgIndex] = useState(getRandomBackgroundIndex(0));
  const [emojis, setEmojis] = useState<string[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // This useEffect hook sets the random emojis when the component first loads
  useEffect(() => {
    setEmojis(getRandomEmojis(EMOJI_POOL, 5, 8)); // Get between 5 and 8 random emojis
  }, []);

  useEffect(() => {
    if (AVAILABLE_BACKGROUNDS.length <= 1) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: BACKGROUND_CONFIG.FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        const newNextIndex = getRandomBackgroundIndex(nextBgIndex);
        setCurrentBgIndex(nextBgIndex);
        setNextBgIndex(newNextIndex);
        fadeAnim.setValue(1);
      });
    }, BACKGROUND_CONFIG.CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [fadeAnim, nextBgIndex]);

  if (levelUp) {
    return (
      <View style={styles.levelUpContainer}>
        <Animated.Image source={AVAILABLE_BACKGROUNDS[currentBgIndex].source} style={styles.backgroundImage} />
        <Text style={styles.levelUpTitle}>Level {level} Cleared!</Text>
        <TouchableOpacity style={styles.nextLevelButton} onPress={nextLevel}>
          <Text style={styles.nextLevelButtonText}>Start Level {level + 1}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={AVAILABLE_BACKGROUNDS[nextBgIndex].source} 
        style={styles.backgroundImage} 
      />
      <Animated.Image 
        source={AVAILABLE_BACKGROUNDS[currentBgIndex].source} 
        style={[styles.backgroundImage, { opacity: fadeAnim }]} 
      />
      
      {/* This line maps over the random emojis and renders them */}
      {emojis.map((emoji, index) => (
        <AnimatedEmoji key={index} emoji={emoji} yRange={[-50, screenHeight]}/>
      ))}
      {/* Banner Ads  */}
      <InlineAd />
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
  backgroundImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover', width: '100%', height: '100%' },
  emoji: { position: 'absolute', fontSize: 30, zIndex: 0, opacity: 0.5 },
  levelUpContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  levelUpTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  nextLevelButton: { backgroundColor: '#FF6B35', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15 },
  nextLevelButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

