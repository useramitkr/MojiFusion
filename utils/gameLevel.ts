import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = 'game_level';
const NEXT_LEVEL_SCORE_KEY = 'game_next_level_score';
const PROGRESS_KEY = 'game_progress';

export type LevelData = {
  level: number;
  nextLevelScore: number;
  progress: number;
};

/**
 * Saves the current level data to AsyncStorage.
 * @param data The level data to save.
 */
export async function saveLevelData(data: LevelData): Promise<void> {
  try {
    await AsyncStorage.setItem(LEVEL_KEY, String(data.level));
    await AsyncStorage.setItem(NEXT_LEVEL_SCORE_KEY, String(data.nextLevelScore));
    await AsyncStorage.setItem(PROGRESS_KEY, String(data.progress));
  } catch (error) {
    console.error('Error saving level data:', error);
  }
}

/**
 * Loads the level data from AsyncStorage.
 * @returns The loaded level data or default values.
 */
export async function loadLevelData(): Promise<LevelData> {
  try {
    const [levelStr, nextLevelScoreStr, progressStr] = await Promise.all([
      AsyncStorage.getItem(LEVEL_KEY),
      AsyncStorage.getItem(NEXT_LEVEL_SCORE_KEY),
      AsyncStorage.getItem(PROGRESS_KEY),
    ]);

    return {
      level: levelStr ? Number(levelStr) : 1,
      nextLevelScore: nextLevelScoreStr ? Number(nextLevelScoreStr) : 500,
      progress: progressStr ? Number(progressStr) : 0,
    };
  } catch (error) {
    console.error('Error loading level data:', error);
    // Return default values in case of an error
    return { level: 1, nextLevelScore: 500, progress: 0 };
  }
}
