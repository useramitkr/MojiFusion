import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  const { score, bestScore } = useGame();
  return (
    <View style={styles.header}>
      <Text style={styles.title}>MojiFusion</Text>
      <Text>Score: {score}</Text>
      <Text>Best: {bestScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: 20 },
  title: { fontSize: 28, fontWeight: "bold" },
});
