// Enhanced GameContext.tsx with new features
import { initBoard, moveBoard } from "@/game/engine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";
import { THEME_DATA } from "@/game/themes";

type GameContextType = {
  board: number[][];
  score: number;
  bestScore: number;
  bestTile: number;
  theme: string;
  switcherCount: number;
  undoCount: number;
  coins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  isFirstTime: boolean;
  isGameOver: boolean;
  showTutorial: boolean;
  animatingTiles: Set<string>;
  unlockedThemes: string[];
  newGame: () => void;
  move: (direction: "up" | "down" | "left" | "right") => void;
  setTheme: (theme: string) => void;
  switchTile: (row: number, col: number, newValue: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  playSound: (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock' | 'swipe' | 'boom' | 'coin' | 'error') => void;
  useSwitcher: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  dismissTutorial: () => void;
  restartGame: () => void;
  buyTheme: (themeId: string) => boolean;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};

// Special tile types
export const SPECIAL_TILES = {
  BOMB: -1,
  COIN: -2,
  REWARD: -3,
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = useState<number[][]>(() => initBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestTile, setBestTile] = useState(0);
  const [theme, setTheme] = useState("fruits");
  const [switcherCount, setSwitcherCount] = useState(0);
  const [undoCount, setUndoCount] = useState(0);
  const [coins, setCoins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['fruits']);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const soundsRef = useRef<Record<string, Audio.Sound>>({});
  const lastMoveTimeRef = useRef(0);

  // Initialize audio system
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        // Load background music
        if (musicEnabled) {
          const { sound } = await Audio.Sound.createAsync(
            require('@/assets/music/background.mp3'), // <-- use require
            { shouldPlay: true, isLooping: true, volume: 0.3 }
          );
          backgroundMusicRef.current = sound;
        }

        // Load sound effects
        const soundFiles = {
          swipe: require('@/assets/music/swipe.mp3'),
          boom: require('@/assets/music/boom.mp3'),
          // Add other sounds here
        };

        for (const [key, file] of Object.entries(soundFiles)) {
          try {
            const { sound } = await Audio.Sound.createAsync(file); // <-- use file directly, not { uri: file }
            soundsRef.current[key] = sound;
          } catch (error) {
            console.log(`Could not load ${key} sound:`, error);
          }
        }

      } catch (error) {
        console.log("Error initializing audio:", error);
      }
    };

    initializeAudio();

    return () => {
      // Cleanup sounds
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unloadAsync();
      }
      Object.values(soundsRef.current).forEach(sound => {
        sound.unloadAsync();
      });
    };
  }, []);

  // Load saved data
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await Promise.all([
          AsyncStorage.getItem("bestScore"),
          AsyncStorage.getItem("bestTile"),
          AsyncStorage.getItem("switcherCount"),
          AsyncStorage.getItem("undoCount"),
          AsyncStorage.getItem("coins"),
          AsyncStorage.getItem("soundEnabled"),
          AsyncStorage.getItem("musicEnabled"),
          AsyncStorage.getItem("isFirstTime"),
          AsyncStorage.getItem("unlockedThemes"),
        ]);

        const [
          bestScoreStr,
          bestTileStr,
          switcherStr,
          undoStr,
          coinsStr,
          soundStr,
          musicStr,
          firstTimeStr,
          unlockedThemesStr
        ] = storedData;

        if (bestScoreStr) setBestScore(Number(bestScoreStr));
        if (bestTileStr) setBestTile(Number(bestTileStr));
        if (switcherStr) setSwitcherCount(Number(switcherStr));
        if (undoStr) setUndoCount(Number(undoStr));
        if (coinsStr) setCoins(Number(coinsStr));
        if (soundStr !== null) setSoundEnabled(soundStr === 'true');
        if (musicStr !== null) setMusicEnabled(musicStr === 'true');

        if (unlockedThemesStr) {
          setUnlockedThemes(JSON.parse(unlockedThemesStr));
        }

        if (firstTimeStr === null) {
          setIsFirstTime(true);
          setShowTutorial(true);
        } else {
          setIsFirstTime(false);
        }

      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  // Play sound effect
  const playSound = useCallback(async (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock' | 'swipe' | 'boom' | 'coin' | 'error') => {
    if (!soundEnabled) return;

    try {
      if (soundsRef.current[type]) {
        await soundsRef.current[type].replayAsync();
      } else {
        // Create programmatic beeps for other sounds
        const frequencies = {
          move: 800,
          merge: 1000,
          switch: 600,
          success: 1200,
          unlock: 1500,
          coin: 1800,
          error: 400,
        };

        if (frequencies[type as keyof typeof frequencies]) {
          // In a real implementation, you'd use Web Audio API or native sound generation
          console.log(`Playing ${type} sound at ${frequencies[type as keyof typeof frequencies]}Hz`);
        }
      }
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

  const toggleMusic = useCallback(async () => {
    const newMusicState = !musicEnabled;
    setMusicEnabled(newMusicState);
    AsyncStorage.setItem("musicEnabled", String(newMusicState));

    try {
      if (backgroundMusicRef.current) {
        if (newMusicState) {
          await backgroundMusicRef.current.playAsync();
        } else {
          await backgroundMusicRef.current.pauseAsync();
        }
      }
    } catch (error) {
      console.log("Error toggling background music:", error);
    }
  }, [musicEnabled]);

  // Add coins and save
  const addCoins = useCallback((amount: number) => {
    setCoins(prev => {
      const newCoins = prev + amount;
      AsyncStorage.setItem("coins", String(newCoins));
      return newCoins;
    });
    playSound('coin');
  }, [playSound]);

  // Spend coins
  const spendCoins = useCallback((amount: number) => {
    if (coins >= amount) {
      setCoins(prev => {
        const newCoins = prev - amount;
        AsyncStorage.setItem("coins", String(newCoins));
        return newCoins;
      });
      return true;
    }
    return false;
  }, [coins]);
  
  // Buy theme function
  const buyTheme = useCallback((themeId: string): boolean => {
    const themeData = THEME_DATA.find(t => t.id === themeId);
    if (!themeData) {
      console.error(`Theme with ID ${themeId} not found.`);
      return false;
    }

    if (unlockedThemes.includes(themeId)) {
      console.log(`Theme ${themeId} is already unlocked.`);
      return false;
    }
    
    if (coins >= themeData.requiredCoins) {
      setCoins(prevCoins => {
        const newCoins = prevCoins - themeData.requiredCoins;
        AsyncStorage.setItem("coins", String(newCoins));
        return newCoins;
      });
      setUnlockedThemes(prev => {
        const newUnlocked = [...prev, themeId];
        AsyncStorage.setItem("unlockedThemes", JSON.stringify(newUnlocked));
        return newUnlocked;
      });
      playSound('unlock');
      return true;
    } else {
      playSound('error');
      return false;
    }
  }, [coins, unlockedThemes, playSound]);


  // Check for game over
  const checkGameOver = useCallback((currentBoard: number[][]) => {
    // Check if board is full
    const isFull = currentBoard.every(row => row.every(cell => cell !== 0));
    if (!isFull) return false;

    // Check for possible moves
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = currentBoard[i][j];
        // Check right
        if (j < 3 && current === currentBoard[i][j + 1]) return false;
        // Check down
        if (i < 3 && current === currentBoard[i + 1][j]) return false;
      }
    }

    return true;
  }, []);

  // Add special tiles randomly
  const addSpecialTile = useCallback((board: number[][]) => {
    if (Math.random() < 0.05) { // 5% chance
      const emptyTiles: [number, number][] = [];
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === 0) emptyTiles.push([i, j]);
        });
      });

      if (emptyTiles.length > 0) {
        const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const specialTypes = [SPECIAL_TILES.BOMB, SPECIAL_TILES.COIN, SPECIAL_TILES.REWARD];
        board[i][j] = specialTypes[Math.floor(Math.random() * specialTypes.length)];
      }
    }
  }, []);

  // Handle special tile effects
  const handleSpecialTile = useCallback((board: number[][], row: number, col: number, tileType: number) => {
    const newBoard = [...board].map(r => [...r]);

    switch (tileType) {
      case SPECIAL_TILES.BOMB:
        // Clear surrounding tiles
        playSound('boom');
        Vibration.vibrate(200);
        for (let i = Math.max(0, row - 1); i <= Math.min(3, row + 1); i++) {
          for (let j = Math.max(0, col - 1); j <= Math.min(3, col + 1); j++) {
            if (newBoard[i][j] > 0) {
              newBoard[i][j] = 0;
            }
          }
        }
        break;

      case SPECIAL_TILES.COIN:
        playSound('coin');
        addCoins(100);
        newBoard[row][col] = 0;
        break;

      case SPECIAL_TILES.REWARD:
        // This is now handled in the move function
        break;
    }

    return newBoard;
  }, [playSound, addCoins]);

  // Enhanced move function
  const move = useCallback((direction: "up" | "down" | "left" | "right") => {
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 100) return; // 100ms throttle
    lastMoveTimeRef.current = now;

    if (isGameOver) return;

    try {
      playSound('swipe');

      const result = moveBoard(board, direction);
      if (!result || !result.newBoard) return;

      const { newBoard, gained, specialEffects } = result;
      const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);

      if (gained > 0 || boardChanged) {
        if (gained > 0) {
          playSound('merge');
          // Convert score to coins (1 coin per 10 points)
          const coinsEarned = Math.floor(gained / 10);
          if (coinsEarned > 0) {
            addCoins(coinsEarned);
          }
        }

        const newScore = score + (gained || 0);
        setBoard(newBoard);
        setScore(newScore);

        // Check for new special tile combinations
        if (specialEffects && specialEffects.length > 0) {
          for (const effect of specialEffects) {
            if (effect.type === 'special_merge' && effect.tile1 === SPECIAL_TILES.REWARD) {
              // Grant a switcher for every gift combo
              setSwitcherCount(prev => prev + 1);
              playSound('unlock');
            }
          }
        }

        // Add special tiles occasionally
        addSpecialTile(newBoard);

        // Update best score
        if (newScore > bestScore) {
          setBestScore(newScore);
          AsyncStorage.setItem("bestScore", String(newScore));
          playSound('success');
        }

        // Update best tile
        const maxTileValue = Math.max(...newBoard.flat().filter(val => val > 0));
        if (maxTileValue > bestTile) {
          setBestTile(maxTileValue);
          AsyncStorage.setItem("bestTile", String(maxTileValue));
        }

        // Check game over
        if (checkGameOver(newBoard)) {
          setIsGameOver(true);
        }
      }
    } catch (error) {
      console.error("Error during move:", error);
    }
  }, [board, score, bestScore, bestTile, isGameOver, checkGameOver, playSound, addCoins, addSpecialTile]);

  const newGame = useCallback(() => {
    const newBoard = initBoard();
    setBoard(newBoard);
    setScore(0);
    setIsGameOver(false);
    playSound('success');
  }, [playSound]);

  const restartGame = useCallback(() => {
    setIsGameOver(false);
    newGame();
  }, [newGame]);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    setIsFirstTime(false);
    AsyncStorage.setItem("isFirstTime", "false");
  }, []);

  const switchTile = useCallback((row: number, col: number, newValue: number) => {
    if (switcherCount <= 0) return;

    const newBoard = board.map((boardRow, i) =>
      boardRow.map((cell, j) =>
        i === row && j === col ? newValue : cell
      )
    );

    setBoard(newBoard);
    setSwitcherCount(prev => {
      const newCount = Math.max(0, prev - 1);
      AsyncStorage.setItem("switcherCount", String(newCount));
      return newCount;
    });

    playSound('switch');
  }, [board, switcherCount, playSound]);

  const useSwitcher = useCallback(() => {
    if (switcherCount <= 0) return;

    const newBoard = [...board].map(row => [...row]);
    const occupiedTiles = [];

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] !== 0) {
          occupiedTiles.push({ row: i, col: j });
        }
      }
    }

    if (occupiedTiles.length === 0) return;

    const shuffledTiles = occupiedTiles.sort(() => 0.5 - Math.random());
    const tilesToClear = Math.ceil(shuffledTiles.length / 2);

    for (let i = 0; i < shuffledTiles.length; i++) {
      const { row, col } = shuffledTiles[i];
      if (i < tilesToClear) {
        newBoard[row][col] = 0;
      } else {
        newBoard[row][col] = 2;
      }
    }

    setBoard(newBoard);
    setSwitcherCount(prev => {
      const newCount = Math.max(0, prev - 1);
      AsyncStorage.setItem("switcherCount", String(newCount));
      return newCount;
    });

    playSound('switch');
  }, [board, switcherCount, playSound]);

  const handleSetTheme = useCallback((newTheme: string) => {
    if (typeof newTheme === 'string' && newTheme.trim().length > 0) {
      setTheme(newTheme);
      AsyncStorage.setItem("theme", newTheme);
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
        coins,
        soundEnabled,
        musicEnabled,
        isFirstTime,
        isGameOver,
        showTutorial,
        animatingTiles,
        unlockedThemes,
        newGame,
        move,
        setTheme: handleSetTheme,
        switchTile,
        toggleSound,
        toggleMusic,
        playSound,
        useSwitcher,
        addCoins,
        spendCoins,
        dismissTutorial,
        restartGame,
        buyTheme,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
