import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Header() {
  const { score, bestScore, bestTile, newGame, theme } = useGame();
  
  const bestTileEmoji = themes[theme][bestTile];

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Fruit Fusion</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>SCORE</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>BEST</Text>
          <Text style={styles.infoValue}>{bestScore}</Text>
        </View>
        {bestTile > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>BEST ITEM</Text>
            <Text style={styles.infoValue}>{bestTileEmoji}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={newGame} style={styles.newGameButton}>
        <Text style={styles.newGameText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    alignItems: "center", 
    marginTop: 20,
    width: "90%",
  },
  title: { 
    fontSize: 48, 
    fontWeight: "bold",
    color: "#776e65",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  infoBox: {
    backgroundColor: "#bbada0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#eee4da",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  newGameButton: {
    marginTop: 20,
    backgroundColor: "#8f7a66",
    padding: 10,
    borderRadius: 6,
  },
  newGameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});