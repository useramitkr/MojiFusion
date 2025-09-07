import { useGame } from "@/context/GameContext";
import React from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";
import { LinearGradient } from 'expo-linear-gradient';

export default function Board() {
  const { board } = useGame();
  
  return (
    <LinearGradient
      colors={['#b8a391', '#a68b5b']}
      style={styles.boardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.grid}>
        {board.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((val, j) => (
              <Tile key={i + "-" + j} value={val} row={i} col={j} />
            ))}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    padding: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  grid: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  row: { 
    flex: 1, 
    flexDirection: "row" 
  },
});