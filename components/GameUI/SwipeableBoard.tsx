import { useGame } from "@/context/GameContext";
import { GRID_SIZE } from "@/game/engine";
import React, { useState } from "react";
import { LayoutChangeEvent, PanResponder, PanResponderInstance, StyleSheet, View } from "react-native";
import Board from "./Board";
import FloatingAnimation from './FloatingAnimation';

export default function SwipeableBoard() {
  const { move, floatingAnimations, removeFloatingAnimation } = useGame();
  const [boardLayout, setBoardLayout] = useState<{width: number, height: number} | null>(null);

  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const sensitivity = 50;
      try {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > sensitivity) move("right");
          else if (dx < -sensitivity) move("left");
        } else {
          if (dy > sensitivity) move("down");
          else if (dy < -sensitivity) move("up");
        }
      } catch (error) {
        console.error("Error in pan responder:", error);
      }
    },
  });

  return (
    <View 
      style={styles.container} 
      {...panResponder.panHandlers}
      onLayout={(event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setBoardLayout({ width, height });
      }}
    >
      <Board />
      {boardLayout && floatingAnimations.map(anim => {
        if (!anim || !anim.position) return null;
        const TILE_CONTAINER_SIZE = boardLayout.width / GRID_SIZE;
        const startPosition = {
          x: anim.position.col * TILE_CONTAINER_SIZE + TILE_CONTAINER_SIZE / 2 - 15,
          y: anim.position.row * TILE_CONTAINER_SIZE + TILE_CONTAINER_SIZE / 2 - 15,
        };
        return (
          <FloatingAnimation 
            key={anim.id} 
            type={anim.type} 
            amount={anim.amount} 
            startPosition={startPosition} 
            onComplete={() => removeFloatingAnimation(anim.id)} 
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    aspectRatio: 1,
    marginTop: 20,
    backgroundColor: "rgba(184, 163, 145, 0.1)",
    borderRadius: 10,
    padding: 4,
  },
});

