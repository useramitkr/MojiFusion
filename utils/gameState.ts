import AsyncStorage from '@react-native-async-storage/async-storage';
import { initBoard } from '@/game/engine';

const BOARD_KEY = 'game_board';
const SCORE_KEY = 'game_score';

export type GameState = {
  board: number[][];
  score: number;
};

/**
 * Saves the current game state (board and current session score) to AsyncStorage.
 * This represents the current game session and gets reset when starting a new game.
 * @param state The game state to save.
 */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(BOARD_KEY, JSON.stringify(state.board));
    await AsyncStorage.setItem(SCORE_KEY, String(state.score));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

/**
 * Loads the current game state from AsyncStorage.
 * @returns The loaded game state or default values (fresh board and score 0).
 */
export async function loadGameState(): Promise<GameState> {
  try {
    const [boardStr, scoreStr] = await Promise.all([
      AsyncStorage.getItem(BOARD_KEY),
      AsyncStorage.getItem(SCORE_KEY),
    ]);

    return {
      board: boardStr ? JSON.parse(boardStr) : initBoard(),
      score: scoreStr ? Number(scoreStr) : 0,
    };
  } catch (error) {
    console.error('Error loading game state:', error);
    return { board: initBoard(), score: 0 };
  }
}

/**
 * Clears the current game state (useful for starting a completely fresh game)
 */
export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(BOARD_KEY);
    await AsyncStorage.removeItem(SCORE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}