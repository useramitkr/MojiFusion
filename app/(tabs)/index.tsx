// app/(tabs)/index.tsx - Updated with new features
import Header from "@/components/GameUI/Header";
import GameOverModal from "@/components/GameUI/GameOverModal";
import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import SwipeableBoard from "@/components/GameUI/SwipeableBoard";
import { useGame } from "@/context/GameContext";
import Tutorial from "@/components/GameUI/Tutorial";

export default function HomeScreen() {
  const { 
    showTutorial, 
    isGameOver, 
    dismissTutorial, 
    restartGame, 
    newGame 
  } = useGame();

  return (
    <ImageBackground 
      source={require('@/assets/images/gamebg.png')} 
      style={styles.container}
    >
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
