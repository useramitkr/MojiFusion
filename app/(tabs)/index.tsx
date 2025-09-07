import Header from "@/components/GameUI/Header";
import React from "react";
import { View, StyleSheet } from "react-native";
import SwipeableBoard from "@/components/GameUI/SwipeableBoard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <SwipeableBoard />
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