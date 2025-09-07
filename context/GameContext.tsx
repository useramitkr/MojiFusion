import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import { initBoard, moveBoard } from "@/game/engine";

type GameContextType = {
  board: number[][];
  score: number;
  bestScore: number;
  bestTile: number;
  theme: string;
  switcherCount: number;
  undoCount: number;
  soundEnabled: boolean;
  newGame: () => void;
  move: (direction: "up" | "down" | "left" | "right") => void;
  setTheme: (theme: string) => void;
  switchTile: (row: number, col: number, newValue: number) => void;
  toggleSound: () => void;
  playSound: (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock') => void;
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
  const [switcherCount, setSwitcherCount] = useState(0);
  const [undoCount, setUndoCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastRewardScore, setLastRewardScore] = useState(0);
  const [sounds, setSounds] = useState<Record<string, Audio.Sound>>({});

  // Initialize sounds
  useEffect(() => {
    const initializeSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        // Create simple beep sounds using different frequencies
        // Note: In a real app, you'd load actual sound files
        console.log("Audio system initialized");
      } catch (error) {
        console.log("Error initializing audio:", error);
      }
    };

    initializeSounds();
  }, []);

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

        const storedSwitcherCount = await AsyncStorage.getItem("switcherCount");
        if (storedSwitcherCount && !isNaN(Number(storedSwitcherCount))) {
          setSwitcherCount(Number(storedSwitcherCount));
        }

        const storedUndoCount = await AsyncStorage.getItem("undoCount");
        if (storedUndoCount && !isNaN(Number(storedUndoCount))) {
          setUndoCount(Number(storedUndoCount));
        }

        const storedSoundEnabled = await AsyncStorage.getItem("soundEnabled");
        if (storedSoundEnabled !== null) {
          setSoundEnabled(storedSoundEnabled === 'true');
        }

        const storedLastRewardScore = await AsyncStorage.getItem("lastRewardScore");
        if (storedLastRewardScore && !isNaN(Number(storedLastRewardScore))) {
          setLastRewardScore(Number(storedLastRewardScore));
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  // Simple beep sound generator (fallback)
  const playSound = useCallback(async (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock') => {
    if (!soundEnabled) return;
    
    try {
      // Create different pitch beeps for different actions
      const frequencies = {
        move: 800,
        merge: 1000,
        switch: 600,
        success: 1200,
        unlock: 1500
      };
      
      // Using Audio.Sound.createAsync with a simple tone
      // Note: In production, you'd use actual sound files
      console.log(`Playing ${type} sound at ${frequencies[type]}Hz`);
      
      // For now, we'll just log the sound. In a real implementation:
      // const { sound } = await Audio.Sound.createAsync({ uri: `path/to/${type}.mp3` });
      // await sound.playAsync();
      
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    AsyncStorage.setItem("soundEnabled", String(newSoundState));
    if (newSoundState) {
      playSound('success');
    }
  }, [soundEnabled, playSound]);

  // Check for rewards based on score milestones
  const checkForRewards = useCallback((newScore: number) => {
    const rewardThreshold = 1000;
    const currentMilestones = Math.floor(newScore / rewardThreshold);
    const lastMilestones = Math.floor(lastRewardScore / rewardThreshold);
    
    if (currentMilestones > lastMilestones) {
      const newSwitchers = currentMilestones - lastMilestones;
      const newUndos = Math.floor(newSwitchers / 2);
      
      setSwitcherCount(prev => {
        const newCount = prev + newSwitchers;
        AsyncStorage.setItem("switcherCount", String(newCount));
        return newCount;
      });
      
      if (newUndos > 0) {
        setUndoCount(prev => {
          const newCount = prev + newUndos;
          AsyncStorage.setItem("undoCount", String(newCount));
          return newCount;
        });
      }
      
      setLastRewardScore(newScore);
      AsyncStorage.setItem("lastRewardScore", String(newScore));
      
      playSound('unlock');
      console.log(`🎉 Rewards earned! +${newSwitchers} Switchers, +${newUndos} Undos`);
    }
  }, [lastRewardScore, playSound]);

  const newGame = useCallback(() => {
    try {
      const newBoard = initBoard();
      setBoard(newBoard);
      setScore(0);
      playSound('success');
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }, [playSound]);

  const move = useCallback((direction: "up" | "down" | "left" | "right") => {
    try {
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
      const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);
      
      if (gained > 0 || boardChanged) {
        playSound(gained > 0 ? 'merge' : 'move');
        
        const newScore = score + (gained || 0);
        setBoard(newBoard);
        setScore(newScore);

        // Check for rewards
        checkForRewards(newScore);

        // Update best score
        if (newScore > bestScore) {
          setBestScore(newScore);
          AsyncStorage.setItem("bestScore", String(newScore));
          playSound('success');
        }

        // Update best tile
        try {
          const maxTileValue = Math.max(...newBoard.flat().filter(val => !isNaN(val) && val > 0));
          if (maxTileValue > bestTile && !isNaN(maxTileValue)) {
            setBestTile(maxTileValue);
            AsyncStorage.setItem("bestTile", String(maxTileValue));
          }
        } catch (error) {
          console.error("Error calculating max tile:", error);
        }
      }
    } catch (error) {
      console.error("Error during move:", error);
    }
  }, [board, score, bestScore, bestTile, checkForRewards, playSound]);

  const switchTile = useCallback((row: number, col: number, newValue: number) => {
    console.log("switchTile called:", { row, col, newValue, switcherCount });
    
    if (switcherCount <= 0) {
      console.log("No switchers available");
      return;
    }
    
    try {
      const newBoard = board.map((boardRow, i) =>
        boardRow.map((cell, j) =>
          i === row && j === col ? newValue : cell
        )
      );
      
      setBoard(newBoard);
      setSwitcherCount(prev => {
        const newCount = Math.max(0, prev - 1);
        AsyncStorage.setItem("switcherCount", String(newCount));
        console.log("Switcher used, remaining:", newCount);
        return newCount;
      });
      
      playSound('switch');
      console.log("Tile switched successfully!");
    } catch (error) {
      console.error("Error switching tile:", error);
    }
  }, [board, switcherCount, playSound]);

  const handleSetTheme = useCallback((newTheme: string) => {
    if (typeof newTheme === 'string' && newTheme.trim().length > 0) {
      setTheme(newTheme);
      playSound('success');
    }
  }, [playSound]);

  return (
    <GameContext.Provider
      value={{ 
        board, 
        score, 
        bestScore, 
        bestTile, 
        theme, 
        switcherCount,
        undoCount,
        soundEnabled,
        newGame, 
        move, 
        setTheme: handleSetTheme,
        switchTile,
        toggleSound,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};