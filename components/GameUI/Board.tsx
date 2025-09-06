import { useGame } from "@/context/GameContext";
import React from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";

export default function Board() {
  const { board } = useGame();
  return (
    <View style={styles.grid}>
      {board.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((val, j) => (
            <Tile key={i + "-" + j} value={val} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    aspectRatio: 1,
    width: "90%",
    marginTop: 20,
  },
  row: { flex: 1, flexDirection: "row" },
});
