import AsyncStorage from "@react-native-async-storage/async-storage";
import { initBoard, moveBoard } from "@/game/engine";
import { THEME_DATA } from "@/game/themes";
import { loadLevelData, saveLevelData } from "@/utils/gameLevel";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type FloatingAnimationType = {
  id: string;
  type: 'key' | 'coin' | 'fire';
  amount?: number;
  position: { row: number; col: number };
};

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
  level: number;
  nextLevelScore: number;
  progress: number;
  levelUp: boolean;
  floatingAnimations: FloatingAnimationType[];
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
  nextLevel: () => void;
  removeFloatingAnimation: (id: string) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};

export const SPECIAL_TILES = { BOMB: -1, COIN: -2, REWARD: -3 };

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
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [nextLevelScore, setNextLevelScore] = useState(200);
  const [progress, setProgress] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [floatingAnimations, setFloatingAnimations] = useState<FloatingAnimationType[]>([]);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const soundsRef = useRef<Record<string, Audio.Sound>>({});
  const lastMoveTimeRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false, staysActiveInBackground: false, playsInSilentModeIOS: true, shouldDuckAndroid: true });
        if (musicEnabled) {
          const { sound } = await Audio.Sound.createAsync(require('@/assets/music/background.mp3'), { shouldPlay: true, isLooping: true, volume: 0.3 });
          backgroundMusicRef.current = sound;
        }
        const soundFiles = { swipe: require('@/assets/music/swipe.mp3'), boom: require('@/assets/music/boom.mp3') };
        for (const [key, file] of Object.entries(soundFiles)) {
          try {
            const { sound } = await Audio.Sound.createAsync(file);
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
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unloadAsync();
        backgroundMusicRef.current = null;
      }
      Object.values(soundsRef.current).forEach(sound => sound.unloadAsync());
    };
  }, [musicEnabled]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [bestScoreStr, bestTileStr, switcherStr, undoStr, coinsStr, soundStr, musicStr, firstTimeStr, unlockedThemesStr, themeStr] = await Promise.all([
          AsyncStorage.getItem("bestScore"), AsyncStorage.getItem("bestTile"), AsyncStorage.getItem("switcherCount"), AsyncStorage.getItem("undoCount"),
          AsyncStorage.getItem("coins"), AsyncStorage.getItem("soundEnabled"), AsyncStorage.getItem("musicEnabled"), AsyncStorage.getItem("isFirstTime"),
          AsyncStorage.getItem("unlockedThemes"), AsyncStorage.getItem("theme"),
        ]);
        if (bestScoreStr) setBestScore(Number(bestScoreStr));
        if (bestTileStr) setBestTile(Number(bestTileStr));
        if (switcherStr) setSwitcherCount(Number(switcherStr));
        if (undoStr) setUndoCount(Number(undoStr));
        if (coinsStr) setCoins(Number(coinsStr));
        if (soundStr !== null) setSoundEnabled(soundStr === 'true');
        if (musicStr !== null) setMusicEnabled(musicStr === 'true');
        if (unlockedThemesStr) setUnlockedThemes(JSON.parse(unlockedThemesStr));
        if (themeStr) setTheme(themeStr);
        if (firstTimeStr === null) { setIsFirstTime(true); setShowTutorial(true); } else { setIsFirstTime(false); }
        const levelData = await loadLevelData();
        setLevel(levelData.level);
        setNextLevelScore(levelData.nextLevelScore);
        setProgress(levelData.progress);
        setScore(levelData.progress);
        if (levelData.progress >= levelData.nextLevelScore) setLevelUp(true);
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };
    loadStoredData();
  }, []);

  const playSound = useCallback(async (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock' | 'swipe' | 'boom' | 'coin' | 'error') => {
    if (!soundEnabled) return;
    try {
      if (soundsRef.current[type]) await soundsRef.current[type].replayAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    AsyncStorage.setItem("soundEnabled", String(newSoundState));
    if (newSoundState) playSound('success');
  }, [soundEnabled, playSound]);

  const toggleMusic = useCallback(async () => {
    const newMusicState = !musicEnabled;
    setMusicEnabled(newMusicState);
    AsyncStorage.setItem("musicEnabled", String(newMusicState));
  }, [musicEnabled]);

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => {
      const newCoins = prev + amount;
      AsyncStorage.setItem("coins", String(newCoins));
      return newCoins;
    });
    playSound('coin');
  }, [playSound]);

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
  
  const buyTheme = useCallback((themeId: string): boolean => {
    const themeData = THEME_DATA.find(t => t.id === themeId);
    if (!themeData || unlockedThemes.includes(themeId)) return false;
    if (coins >= themeData.requiredCoins) {
      spendCoins(themeData.requiredCoins);
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
  }, [coins, unlockedThemes, playSound, spendCoins]);

  const checkGameOver = useCallback((currentBoard: number[][]) => {
    const isFull = currentBoard.every(row => row.every(cell => cell !== 0));
    if (!isFull) return false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const current = currentBoard[i][j];
            if (j < 3 && (current === currentBoard[i][j + 1] || current < 0 || currentBoard[i][j+1] < 0)) return false;
            if (i < 3 && (current === currentBoard[i + 1][j] || current < 0 || currentBoard[i+1][j] < 0)) return false;
        }
    }
    return true;
  }, []);
  
  const move = useCallback(async (direction: "up" | "down" | "left" | "right") => {
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 100 || isGameOver || levelUp) return;
    lastMoveTimeRef.current = now;

    playSound('swipe');
    const { newBoard, gained, specialEffects, newAnimations, coinsGained } = moveBoard(board, direction);
    const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);

    if (newAnimations && newAnimations.length > 0) setFloatingAnimations(prev => [...prev, ...newAnimations]);
    if (coinsGained > 0) addCoins(coinsGained);

    if (gained > 0 || boardChanged) {
        if (gained > 0) playSound('merge');

        if (specialEffects && specialEffects.length > 0) {
            for (const effect of specialEffects) {
                if (effect.type === 'special_merge' && (effect.tile1 === SPECIAL_TILES.REWARD || effect.tile2 === SPECIAL_TILES.REWARD)) {
                    setSwitcherCount(prev => {
                        const newCount = prev + 1;
                        AsyncStorage.setItem("switcherCount", String(newCount));
                        return newCount;
                    });
                    playSound('unlock');
                }
            }
        }

        const newScore = score + gained;
        if (newScore >= nextLevelScore) {
            setLevelUp(true);
            const finalProgress = nextLevelScore;
            setScore(finalProgress);
            setProgress(finalProgress);
            await saveLevelData({ level, nextLevelScore, progress: finalProgress });
            playSound('success');
            router.push('/(tabs)');
        } else {
            setBoard(newBoard);
            setScore(newScore);
            setProgress(newScore);
            await saveLevelData({ level, nextLevelScore, progress: newScore });
            if (newScore > bestScore) {
                setBestScore(newScore);
                AsyncStorage.setItem("bestScore", String(newScore));
            }
            const maxTileValue = Math.max(...newBoard.flat().filter(val => val > 0));
            if (maxTileValue > bestTile) {
                setBestTile(maxTileValue);
                AsyncStorage.setItem("bestTile", String(maxTileValue));
            }
        }
    }
    if (checkGameOver(newBoard)) {
        setIsGameOver(true);
    }
  }, [board, score, bestScore, bestTile, isGameOver, levelUp, level, nextLevelScore, checkGameOver, playSound, router, addCoins]);

  const removeFloatingAnimation = (id: string) => {
    setFloatingAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  const newGame = useCallback(() => {
    setBoard(initBoard());
    setScore(progress); 
    setIsGameOver(false);
    playSound('success');
  }, [playSound, progress]);

  const nextLevel = useCallback(async () => {
    const newLevel = level + 1;
    const newNextLevelScore = 200 * newLevel;
    setLevel(newLevel);
    setNextLevelScore(newNextLevelScore);
    setScore(0);
    setProgress(0);
    setLevelUp(false);
    setBoard(initBoard());
    await saveLevelData({ level: newLevel, nextLevelScore: newNextLevelScore, progress: 0 });
  }, [level]);

  const restartGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setProgress(0);
    setBoard(initBoard());
    saveLevelData({level, nextLevelScore, progress: 0});
  }, [level, nextLevelScore]);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    setIsFirstTime(false);
    AsyncStorage.setItem("isFirstTime", "false");
  }, []);

  const switchTile = useCallback((row: number, col: number, newValue: number) => {
    if (switcherCount <= 0) return;
    const newBoard = board.map((r, i) => r.map((c, j) => (i === row && j === col ? newValue : c)));
    setBoard(newBoard);
    setSwitcherCount(prev => {
      const newCount = prev - 1;
      AsyncStorage.setItem("switcherCount", String(newCount));
      return newCount;
    });
    playSound('switch');
  }, [board, switcherCount, playSound]);

  const useSwitcher = useCallback(() => {
    if (switcherCount <= 0) return;
    const newBoard = [...board].map(row => [...row]);
    const occupiedTiles = [];
    for (let i = 0; i < newBoard.length; i++) for (let j = 0; j < newBoard[i].length; j++) if (newBoard[i][j] !== 0) occupiedTiles.push({ row: i, col: j });
    if (occupiedTiles.length === 0) return;
    const shuffledTiles = occupiedTiles.sort(() => 0.5 - Math.random());
    const tilesToClear = Math.ceil(shuffledTiles.length / 2);
    for (let i = 0; i < shuffledTiles.length; i++) {
      const { row, col } = shuffledTiles[i];
      newBoard[row][col] = i < tilesToClear ? 0 : 2;
    }
    setBoard(newBoard);
    setSwitcherCount(prev => {
      const newCount = prev - 1;
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
        board, score, bestScore, bestTile, theme, switcherCount, undoCount, coins,
        soundEnabled, musicEnabled, isFirstTime, isGameOver, showTutorial,
        animatingTiles, unlockedThemes, level, nextLevelScore, progress, levelUp,
        floatingAnimations, newGame, move, setTheme: handleSetTheme, switchTile, toggleSound,
        toggleMusic, playSound, useSwitcher, addCoins, spendCoins, dismissTutorial,
        restartGame, buyTheme, nextLevel, removeFloatingAnimation
      }}
    >
      {children}
    </GameContext.Provider>
  );
};