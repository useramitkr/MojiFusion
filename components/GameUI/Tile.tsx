import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { value: number };

export default function Tile({ value }: Props) {
  const { theme } = useGame();
  if (value === 0) return <View style={styles.empty} />;
  return (
    <View style={styles.tile}>
      <Text style={styles.text}>{themes[theme][value] || value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    margin: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  tile: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fce",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  text: { fontSize: 28 },
});
