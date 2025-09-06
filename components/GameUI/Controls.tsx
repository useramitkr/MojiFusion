import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Button, StyleSheet } from "react-native";

export default function Controls() {
  const { newGame, move } = useGame();
  return (
    <View style={styles.controls}>
      <Button title="New Game" onPress={newGame} />
      <Button title="⬆️" onPress={() => move("up")} />
      <Button title="⬇️" onPress={() => move("down")} />
      <Button title="⬅️" onPress={() => move("left")} />
      <Button title="➡️" onPress={() => move("right")} />
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
