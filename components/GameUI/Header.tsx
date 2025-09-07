import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Header() {
  const { score, bestScore, bestTile, newGame, theme } = useGame();
  
  const bestTileEmoji = themes[theme][bestTile] || "❓";

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Fruit Fusion</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>SCORE</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>BEST</Text>
          <Text style={styles.infoValue}>{bestScore}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>BEST ITEM</Text>
          <Text style={styles.infoValue}>{bestTileEmoji}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>🎲 (2)</Text>
        </View>
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>↩️ (2)</Text>
        </View>
        <TouchableOpacity onPress={newGame} style={styles.newGameButton}>
          <Text style={styles.newGameText}>New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 20,
    width: "95%",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#776e65",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: "#776e65",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5b5046",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fcecd5",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#776e65",
  },
  newGameButton: {
    flex: 1.5,
    backgroundColor: "#f59563",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newGameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});