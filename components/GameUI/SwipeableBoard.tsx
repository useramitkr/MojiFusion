import React, { useState } from "react";
import { StyleSheet, View, PanResponder, PanResponderInstance } from "react-native";
import { useGame } from "@/context/GameContext";
import Board from "./Board";

export default function SwipeableBoard() {
  const { move } = useGame();
  
  // Fallback using React Native's built-in PanResponder instead of Gesture Handler
  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: () => {
      console.log("Pan responder granted");
    },
    
    onPanResponderMove: (evt, gestureState) => {
      // Optional: You can add visual feedback here
    },
    
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const sensitivity = 50;
      
      console.log("Pan responder release:", { dx, dy });
      
      try {
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > sensitivity) {
            move("right");
          } else if (dx < -sensitivity) {
            move("left");
          }
        } else {
          // Vertical swipe
          if (dy > sensitivity) {
            move("down");
          } else if (dy < -sensitivity) {
            move("up");
          }
        }
      } catch (error) {
        console.error("Error in pan responder:", error);
      }
    },
    
    onPanResponderTerminate: () => {
      console.log("Pan responder terminated");
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Board />
    </View>
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