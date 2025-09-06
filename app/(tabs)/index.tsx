import Board from "@/components/GameUI/Board";
import Controls from "@/components/GameUI/Controls";
import Header from "@/components/GameUI/Header";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Board />
      <Controls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
});
