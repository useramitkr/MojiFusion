// utils/backgroundManager.ts
export type BackgroundImage = {
  id: number;
  source: any; // require() result
  name: string;
  category?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};

// All available backgrounds - Easy to add more!
export const AVAILABLE_BACKGROUNDS: BackgroundImage[] = [
  { 
    id: 1, 
    source: require('@/assets/images/gamebg.webp'), 
    name: 'Lava World',
    category: 'Fire',
    rarity: 'common'
  },
  { 
    id: 2, 
    source: require('@/assets/images/lavabg.webp'), 
    name: 'Game Zone',
    category: 'Tech',
    rarity: 'common'
  },
  { 
    id: 3, 
    source: require('@/assets/images/oceanbg.webp'), 
    name: 'Ocean Depths',
    category: 'Water',
    rarity: 'common'
  },
  { 
    id: 4, 
    source: require('@/assets/images/forestbg.webp'), 
    name: 'Mystic Forest',
    category: 'Nature',
    rarity: 'rare'
  },
  { 
    id: 5, 
    source: require('@/assets/images/spacebg.webp'), 
    name: 'Cosmic Void',
    category: 'Space',
    rarity: 'epic'
  },
  { 
    id: 6, 
    source: require('@/assets/images/crystalbg.webp'), 
    name: 'Crystal Cave',
    category: 'Mystical',
    rarity: 'rare'
  },
  { 
    id: 7, 
    source: require('@/assets/images/desertbg.webp'), 
    name: 'Desert Oasis',
    category: 'Desert',
    rarity: 'common'
  },
  { 
    id: 8, 
    source: require('@/assets/images/cyberpunkbg.webp'), 
    name: 'Neon City',
    category: 'Cyberpunk',
    rarity: 'legendary'
  }
];

// Configuration
export const BACKGROUND_CONFIG = {
  CHANGE_INTERVAL: 3 * 60 * 1000, // 3 minutes
  FADE_DURATION: 1000, // 1 second fade transition
  ENABLE_RARITY_WEIGHTS: false, // Set to true if you want rarer backgrounds to appear less frequently
};

// Rarity weights (if enabled)
const RARITY_WEIGHTS = {
  common: 100,
  rare: 30,
  epic: 10,
  legendary: 5,
};

/**
 * Get a random background index, optionally excluding the current one
 */
export function getRandomBackgroundIndex(excludeIndex?: number): number {
  if (AVAILABLE_BACKGROUNDS.length <= 1) return 0;
  
  let availableBackgrounds = AVAILABLE_BACKGROUNDS;
  
  // Exclude current background if specified
  if (excludeIndex !== undefined) {
    availableBackgrounds = AVAILABLE_BACKGROUNDS.filter((_, index) => index !== excludeIndex);
  }
  
  // Simple random selection if rarity weights are disabled
  if (!BACKGROUND_CONFIG.ENABLE_RARITY_WEIGHTS) {
    const randomBackground = availableBackgrounds[Math.floor(Math.random() * availableBackgrounds.length)];
    return AVAILABLE_BACKGROUNDS.findIndex(bg => bg.id === randomBackground.id);
  }
  
  // Weighted random selection based on rarity
  const weightedBackgrounds: number[] = [];
  availableBackgrounds.forEach((bg, index) => {
    const originalIndex = AVAILABLE_BACKGROUNDS.findIndex(orig => orig.id === bg.id);
    const weight = RARITY_WEIGHTS[bg.rarity || 'common'];
    for (let i = 0; i < weight; i++) {
      weightedBackgrounds.push(originalIndex);
    }
  });
  
  return weightedBackgrounds[Math.floor(Math.random() * weightedBackgrounds.length)];
}

/**
 * Get background by category
 */
export function getBackgroundsByCategory(category: string): BackgroundImage[] {
  return AVAILABLE_BACKGROUNDS.filter(bg => bg.category === category);
}

/**
 * Get background by rarity
 */
export function getBackgroundsByRarity(rarity: string): BackgroundImage[] {
  return AVAILABLE_BACKGROUNDS.filter(bg => bg.rarity === rarity);
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(AVAILABLE_BACKGROUNDS.map(bg => bg.category).filter(Boolean))) as string[];
}

/**
 * Get background info by index
 */
export function getBackgroundInfo(index: number): BackgroundImage | null {
  return AVAILABLE_BACKGROUNDS[index] || null;
}
