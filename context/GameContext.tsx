// context/GameContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initBoard, moveBoard } from "@/game/engine";

type GameContextType = {
  board: number[][];
  score: number;
  bestScore: number;
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
  const [board, setBoard] = useState<number[][]>(initBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [theme, setTheme] = useState("fruits");

  useEffect(() => {
    (async () => {
      const storedBest = await AsyncStorage.getItem("bestScore");
      if (storedBest) setBestScore(Number(storedBest));
    })();
  }, []);

  const newGame = () => {
    setBoard(initBoard());
    setScore(0);
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    const { newBoard, gained } = moveBoard(board, direction);
    if (gained > 0 || JSON.stringify(board) !== JSON.stringify(newBoard)) {
      const newScore = score + gained;
      setBoard(newBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        AsyncStorage.setItem("bestScore", String(newScore));
      }
    }
  };

  return (
    <GameContext.Provider
      value={{ board, score, bestScore, theme, newGame, move, setTheme }}
    >
      {children}
    </GameContext.Provider>
  );
};
