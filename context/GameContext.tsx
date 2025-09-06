import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initBoard, moveBoard } from "@/game/engine";

type GameContextType = {
  board: number[][];
  score: number;
  bestScore: number;
  bestTile: number;
  theme: string;
  newGame: () => void;
  move: (direction: "up" | "down" | "left" | "right") => void;
  setTheme: (theme: string) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = useState<number[][]>(() => initBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestTile, setBestTile] = useState(0);
  const [theme, setTheme] = useState("fruits");

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedBestScore = await AsyncStorage.getItem("bestScore");
        if (storedBestScore && !isNaN(Number(storedBestScore))) {
          setBestScore(Number(storedBestScore));
        }

        const storedBestTile = await AsyncStorage.getItem("bestTile");
        if (storedBestTile && !isNaN(Number(storedBestTile))) {
          setBestTile(Number(storedBestTile));
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  const newGame = useCallback(() => {
    try {
      const newBoard = initBoard();
      setBoard(newBoard);
      setScore(0);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }, []);

  const move = useCallback((direction: "up" | "down" | "left" | "right") => {
    try {
      // Validate direction
      if (!["up", "down", "left", "right"].includes(direction)) {
        console.warn("Invalid move direction:", direction);
        return;
      }

      const result = moveBoard(board, direction);
      if (!result || !result.newBoard) {
        console.warn("Invalid move result");
        return;
      }

      const { newBoard, gained } = result;
      
      // Check if board actually changed or points were gained
      const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);
      
      if (gained > 0 || boardChanged) {
        const newScore = score + (gained || 0);
        setBoard(newBoard);
        setScore(newScore);

        // Update best score
        if (newScore > bestScore) {
          setBestScore(newScore);
          AsyncStorage.setItem("bestScore", String(newScore)).catch((error) => {
            console.error("Error saving best score:", error);
          });
        }

        // Update best tile
        try {
          const maxTileValue = Math.max(...newBoard.flat().filter(val => !isNaN(val) && val > 0));
          if (maxTileValue > bestTile && !isNaN(maxTileValue)) {
            setBestTile(maxTileValue);
            AsyncStorage.setItem("bestTile", String(maxTileValue)).catch((error) => {
              console.error("Error saving best tile:", error);
            });
          }
        } catch (error) {
          console.error("Error calculating max tile:", error);
        }
      }
    } catch (error) {
      console.error("Error during move:", error);
    }
  }, [board, score, bestScore, bestTile]);

  const handleSetTheme = useCallback((newTheme: string) => {
    if (typeof newTheme === 'string' && newTheme.trim().length > 0) {
      setTheme(newTheme);
    }
  }, []);

  return (
    <GameContext.Provider
      value={{ 
        board, 
        score, 
        bestScore, 
        bestTile, 
        theme, 
        newGame, 
        move, 
        setTheme: handleSetTheme 
      }}
    >
      {children}
    </GameContext.Provider>
  );
};