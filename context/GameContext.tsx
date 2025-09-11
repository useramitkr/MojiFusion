import AsyncStorage from "@react-native-async-storage/async-storage";
import { initBoard, moveBoard } from "@/game/engine";
import { THEME_DATA } from "@/game/themes";
import { saveUserProgress, loadUserProgress } from "@/utils/userProgress";
import { saveGameState, loadGameState } from "@/utils/gameState";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
// --- REWARDED AD: Import necessary modules ---
// We import Platform to check the OS and modules from react-native-google-mobile-ads.
import { Platform } from 'react-native';
import {
  RewardedAd as AdmobRewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
// --- END REWARDED AD ---

type FloatingAnimationType = {
  id: string;
  type: 'key' | 'coin' | 'fire';
  amount?: number;
  position: { row: number; col: number };
};

// --- REWARDED AD: Define Ad Unit IDs ---
// This is where we define the ad unit IDs for rewarded video ads.
// We use test IDs during development to avoid policy violations with AdMob.
const androidAdmobRewarded = "ca-app-pub-3010808812913571/3837625774";
const iosAdmobRewarded = "ca-app-pub-12345678910/12345678910"; // Placeholder for iOS
const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
    ? iosAdmobRewarded
    : androidAdmobRewarded;
// --- END REWARDED AD ---

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
  // --- REWARDED AD: Add to context type ---
  // We expose the ad loading state and the function to show an ad.
  showRewardedAd: (onEarned: () => void, adType: 'key' | 'coins') => void;
  rewardedAdLoadingFor: 'key' | 'coins' | null;
  // --- END REWARDED AD ---
  newGame: () => void;
  move: (direction: "up" | "down" | "left" | "right") => void;
  setTheme: (theme: string) => void;
  switchTile: (row: number, col: number, newValue: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  playSound: (type: 'move' | 'merge' | 'switch' | 'success' | 'unlock' | 'swipe' | 'boom' | 'coin' | 'error') => void;
  useSwitcher: () => void;
  resumeWithSwitcher: () => void;
  addCoins: (amount: number) => void;
  addKey: () => void;
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
  // --- REWARDED AD: State for loading status ---
  // This state tracks which type of reward ad is currently loading ('key' or 'coins').
  const [rewardedAdLoadingFor, setRewardedAdLoadingFor] = useState<'key' | 'coins' | null>(null);
  // --- END REWARDED AD ---
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
        // Load persistent user progress (level, nextLevelScore, overall progress)
        const userProgress = await loadUserProgress();
        setLevel(userProgress.level);
        setNextLevelScore(userProgress.nextLevelScore);
        setProgress(userProgress.progress);

        // Load current game state (board and current game score)
        const gameState = await loadGameState();
        setBoard(gameState.board);
        setScore(gameState.score);

        // Load other game data
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

        // Check if level up should be triggered
        if (userProgress.progress >= userProgress.nextLevelScore) {
          setLevelUp(true);
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };
    loadStoredData();
  }, []);

  // --- REWARDED AD: Function to load and show ad ---
  // This function is now centralized in the context to be used anywhere in the app.
  const showRewardedAd = useCallback((onEarned: () => void, adType: 'key' | 'coins') => {
    // Prevent multiple ads from loading simultaneously
    if (rewardedAdLoadingFor) {
      return;
    }
    setRewardedAdLoadingFor(adType);

    const rewardedAd = AdmobRewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardedAd.show();
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        onEarned(); // Grant the reward
      },
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        setRewardedAdLoadingFor(null); // Reset loading state
      }
    )

    const unsubscribeError = rewardedAd.addAdEventListener(
      'ad-event',
      (event) => {
        if (event.type === 'error' || event.type === RewardedAdEventType.FAILED_TO_LOAD) {
          console.error('Ad failed to load or show', event.payload);
          setRewardedAdLoadingFor(null); // Reset loading state on error
        }
      }
    )

    // Start loading the ad
    rewardedAd.load();

    // The library handles listener cleanup implicitly when the ad is closed or fails.
    // For this use case, we don't need to return and call the unsubscribe functions manually.
  }, [rewardedAdLoadingFor]);
  // --- END REWARDED AD ---

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
    if (amount > 0) {
      playSound('coin');
    }
  }, [playSound]);

  const addKey = useCallback(() => {
    setSwitcherCount(prev => {
      const newCount = prev + 1;
      AsyncStorage.setItem("switcherCount", String(newCount));
      return newCount;
    });
    playSound('unlock');
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
    if (!isFull) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = currentBoard[i][j];
        if (j < 3) {
          const right = currentBoard[i][j + 1];
          if ((current > 0 && current === right) || (current < 0 && right < 0)) return false;
        }
        if (i < 3) {
          const bottom = currentBoard[i + 1][j];
          if ((current > 0 && current === bottom) || (current < 0 && bottom < 0)) return false;
        }
      }
    }
    return true;
  }, []);

  const move = useCallback(async (direction: "up" | "down" | "left" | "right") => {
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 100 || isGameOver || levelUp) return;
    lastMoveTimeRef.current = now;

    playSound('swipe');
    const { newBoard, gained, specialEffects, newAnimations, coinsGained: specialCoins } = moveBoard(board, direction);
    const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);

    if (newAnimations && newAnimations.length > 0) setFloatingAnimations(prev => [...prev, ...newAnimations]);

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

      const oldScore = score;
      const newScore = oldScore + gained;
      const newTotalProgress = progress + gained;

      const coinsFromScore = Math.floor(newScore / 10) - Math.floor(oldScore / 10);
      const totalCoinsGained = specialCoins + coinsFromScore;
      if (totalCoinsGained > 0) {
        addCoins(totalCoinsGained);
      }

      // Check if player has reached the next level
      if (newTotalProgress >= nextLevelScore) {
        setLevelUp(true);
        const finalProgress = newTotalProgress;
        setScore(newScore);
        setProgress(finalProgress);
        // Save both game state and user progress
        await saveGameState({ board: newBoard, score: newScore });
        await saveUserProgress({ level, nextLevelScore, progress: finalProgress });
        playSound('success');
        router.push('/(tabs)');
      } else {
        // Normal gameplay - update everything
        setBoard(newBoard);
        setScore(newScore);
        setProgress(newTotalProgress);

        // Save both game state and user progress
        await saveGameState({ board: newBoard, score: newScore });
        await saveUserProgress({ level, nextLevelScore, progress: newTotalProgress });

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

      if (checkGameOver(newBoard)) {
        setIsGameOver(true);
      }
    } else {
      if (checkGameOver(board)) {
        setIsGameOver(true);
      }
    }
  }, [board, score, progress, bestScore, bestTile, isGameOver, levelUp, level, nextLevelScore, checkGameOver, playSound, router, addCoins]);

  const removeFloatingAnimation = (id: string) => {
    setFloatingAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  // Fixed newGame function - only resets current game session, not user progress
  const newGame = useCallback(async () => {
    const newBoard = initBoard();
    setBoard(newBoard);
    setScore(0); // Reset current game score
    setIsGameOver(false);

    // Save only the game state (board and current score), NOT the user progress
    await saveGameState({ board: newBoard, score: 0 });

    playSound('success');
  }, [playSound]);

  const nextLevel = useCallback(async () => {
    const newLevel = level + 1;
    const newNextLevelScore = 200 * newLevel;
    const newBoard = initBoard();

    setLevel(newLevel);
    setNextLevelScore(newNextLevelScore);
    setScore(0);
    setProgress(0); // Reset progress for the new level
    setLevelUp(false);
    setBoard(newBoard);

    // Save both user progress (with new level) and game state (fresh board)
    await saveUserProgress({ level: newLevel, nextLevelScore: newNextLevelScore, progress: 0 });
    await saveGameState({ board: newBoard, score: 0 });
  }, [level]);

  const restartGame = useCallback(async () => {
    const newBoard = initBoard();
    setIsGameOver(false);
    setScore(0);
    setBoard(newBoard);

    // Save the game state but keep user progress intact
    await saveGameState({ board: newBoard, score: 0 });
  }, []);

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
    // Save the updated board state
    saveGameState({ board: newBoard, score });
    playSound('switch');
  }, [board, switcherCount, score, playSound]);

  const useSwitcher = useCallback(async () => {
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
    // Save the updated board state
    await saveGameState({ board: newBoard, score });
    playSound('switch');
  }, [board, switcherCount, score, playSound]);

  const resumeWithSwitcher = useCallback(() => {
    if (switcherCount > 0) {
      setIsGameOver(false);
      useSwitcher();
    }
  }, [switcherCount, useSwitcher]);

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
        floatingAnimations,
        // --- REWARDED AD: Expose via context provider ---
        showRewardedAd,
        rewardedAdLoadingFor,
        // --- END REWARDED AD ---
        newGame, move, setTheme: handleSetTheme, switchTile, toggleSound,
        toggleMusic, playSound, useSwitcher, addCoins, spendCoins, dismissTutorial,
        restartGame, buyTheme, nextLevel, removeFloatingAnimation, resumeWithSwitcher, addKey
      }}
    >
      {children}
    </GameContext.Provider>
  );
};