import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = 'user_level';
const NEXT_LEVEL_SCORE_KEY = 'user_next_level_score';
const PROGRESS_KEY = 'user_progress';

export type UserProgress = {
  level: number;
  nextLevelScore: number;
  progress: number;
};

/**
 * Saves the user's progress to AsyncStorage.
 * This includes their current level, the score needed for next level, and total accumulated progress.
 * @param data The user progress data to save.
 */
export async function saveUserProgress(data: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(LEVEL_KEY, String(data.level));
    await AsyncStorage.setItem(NEXT_LEVEL_SCORE_KEY, String(data.nextLevelScore));
    await AsyncStorage.setItem(PROGRESS_KEY, String(data.progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

/**
 * Loads the user progress from AsyncStorage.
 * @returns The loaded user progress or default values.
 */
export async function loadUserProgress(): Promise<UserProgress> {
  try {
    const [levelStr, nextLevelScoreStr, progressStr] = await Promise.all([
      AsyncStorage.getItem(LEVEL_KEY),
      AsyncStorage.getItem(NEXT_LEVEL_SCORE_KEY),
      AsyncStorage.getItem(PROGRESS_KEY),
    ]);

    return {
      level: levelStr ? Number(levelStr) : 1,
      nextLevelScore: nextLevelScoreStr ? Number(nextLevelScoreStr) : 200,
      progress: progressStr ? Number(progressStr) : 0,
    };
  } catch (error) {
    console.error('Error loading user progress:', error);
    // Return default values in case of an error
    return { level: 1, nextLevelScore: 200, progress: 0 };
  }
}