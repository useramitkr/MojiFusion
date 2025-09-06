import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useGame } from "@/context/GameContext";
import Board from "./Board";

export default function SwipeableBoard() {
  const { move } = useGame();
  
  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      const { translationX, translationY } = e;
      const sensitivity = 50;
      
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        if (translationX > sensitivity) {
          move("right");
        } else if (translationX < -sensitivity) {
          move("left");
        }
      } else {
        // Vertical swipe
        if (translationY > sensitivity) {
          move("down");
        } else if (translationY < -sensitivity) {
          move("up");
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Board />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    aspectRatio: 1,
    marginTop: 20,
    backgroundColor: "#b8a391",
    borderRadius: 10,
    padding: 4,
  },
});