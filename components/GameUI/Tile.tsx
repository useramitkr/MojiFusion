import { useGame } from "@/context/GameContext";
import { TILE_COLORS } from "@/utils/constants";
import { themes } from "@/game/themes";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { value: number };

export default function Tile({ value }: Props) {
  const { theme } = useGame();
  
  if (value === 0) {
    return <View style={styles.empty} />;
  }

  const emoji = themes[theme][value];
  const tileColor = TILE_COLORS[`tile${value}` as keyof typeof TILE_COLORS] || TILE_COLORS.background;

  return (
    <View style={[styles.tile, { backgroundColor: tileColor }]}>
      <Text style={styles.text}>{emoji || value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    margin: 4,
    backgroundColor: TILE_COLORS.empty,
    borderRadius: 8,
  },
  tile: {
    flex: 1,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: { 
    fontSize: 28,
    fontWeight: 'bold',
  },
});