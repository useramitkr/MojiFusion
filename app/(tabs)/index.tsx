// app/(tabs)/index.tsx - Updated with new features
import Header from "@/components/GameUI/Header";
import GameOverModal from "@/components/GameUI/GameOverModal";
import React from "react";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.container}>
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
    backgroundColor: "#fbf8ef"
  },
});