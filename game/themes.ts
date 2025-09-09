// game/themes.ts
export const themes: Record<string, Record<number, string>> = {
  fruits: {
    2: "🍎",
    4: "🍌",
    8: "🍇",
    16: "🍊",
    32: "🍉",
    64: "🍍",
    128: "🥭",
    256: "🥝",
    512: "🍓",
    1024: "🥥",
    2048: "🍒",
  },

  animals: {
    2: "🐷",
    4: "🐮",
    8: "🐸",
    16: "🐔",
    32: "🐰",
    64: "🐨",
    128: "🐵",
    256: "🐺",
    512: "🦊",
    1024: "🐻",
    2048: "🦁",
  },

  wild_animals: {
    2: "🦁",
    4: "🐯",
    8: "🐻",
    16: "🐺",
    32: "🦊",
    64: "🐨",
    128: "🐼",
    256: "🦏",
    512: "🦒",
    1024: "🐘",
    2048: "🦣",
  },

  ocean: {
    2: "🐠",
    4: "🐙",
    8: "🦈",
    16: "🐳",
    32: "🐟",
    64: "🦀",
    128: "🦞",
    256: "🐋",
    512: "🦑",
    1024: "🐬",
    2048: "🦭",
  },

  faces: {
    2: "😀",
    4: "😁",
    8: "😂",
    16: "🤣",
    32: "😅",
    64: "😊",
    128: "😍",
    256: "🤩",
    512: "😎",
    1024: "🤯",
    2048: "👑",
  },

  professions: {
    2: "👨‍⚕️",
    4: "👨‍🚀",
    8: "👨‍🍳",
    16: "👨‍🎨",
    32: "👨‍💻",
    64: "👨‍🏫",
    128: "👨‍🔬",
    256: "👨‍⚖️",
    512: "👨‍🚒",
    1024: "👨‍✈️",
    2048: "👨‍💼",
  },

  sports: {
    2: "⚽",
    4: "🏀",
    8: "🎾",
    16: "🏈",
    32: "⚾",
    64: "🏐",
    128: "🏓",
    256: "🏸",
    512: "🥊",
    1024: "🏆",
    2048: "🥇",
  },

  space: {
    2: "🚀",
    4: "🛸",
    8: "👽",
    16: "🌟",
    32: "🌙",
    64: "☀️",
    128: "🪐",
    256: "🌍",
    512: "🌌",
    1024: "🛰️",
    2048: "💫",
  },

  vehicles: {
    2: "🚗",
    4: "✈️",
    8: "🚂",
    16: "🚁",
    32: "🚢",
    64: "🚙",
    128: "🚐",
    256: "🚛",
    512: "🏎️",
    1024: "🚤",
    2048: "🛥️",
  },

  human: {
    2: "👶",
    4: "👩‍🦱",
    8: "🧑‍🎓",
    16: "👨‍⚕️",
    32: "👫",
    64: "👩‍❤️‍👨",
    128: "🤱",
    256: "👯‍♀️",
    512: "🧑‍✈️",
    1024: "👴🏼",
    2048: "🪦",
  },
};

export const THEME_DATA = [
  {
    id: "fruits",
    name: "Fruits",
    icon: "🍎",
    requiredScore: 0,
    requiredCoins: 0,
    category: "Nature",
    preview: ["🍎", "🍌", "🍇", "🍊"]
  },
  {
    id: "animals",
    name: "Farm Animals",
    icon: "🐷",
    requiredScore: 2500,
    requiredCoins: 100,
    category: "Animals",
    preview: ["🐷", "🐮", "🐸", "🐔"]
  },
  {
    id: "wild_animals",
    name: "Wild Animals",
    icon: "🦁",
    requiredScore: 5000,
    requiredCoins: 200,
    category: "Animals",
    preview: ["🦁", "🐯", "🐻", "🐺"]
  },
  { 
    id: "ocean", 
    name: "Ocean Life", 
    icon: "🐠", 
    requiredScore: 7500, 
    requiredCoins: 300, 
    category: "Nature", 
    preview: ["🐠", "🐙", "🦈", "🐳"] 
  },
  { 
    id: "faces", 
    name: "Emotions", 
    icon: "😀", 
    requiredScore: 10000, 
    requiredCoins: 350, 
    category: "Human", 
    preview: ["😀", "😍", "🤩", "😎"] 
  },
  { 
    id: "professions", 
    name: "Professions", 
    icon: "👨‍⚕️", 
    requiredScore: 12500, 
    requiredCoins: 500, 
    category: "Human", 
    preview: ["👨‍⚕️", "👨‍🚀", "👨‍🍳", "👨‍🎨"] 
  },
  { 
    id: "sports", 
    name: "Sports", 
    icon: "⚽", 
    requiredScore: 15000, 
    requiredCoins: 300, 
    category: "Activities", 
    preview: ["⚽", "🏀", "🎾", "🏈"] 
  },
  { 
    id: "space", 
    name: "Space", 
    icon: "🚀", 
    requiredScore: 17500, 
    requiredCoins: 300, 
    category: "Fantasy", 
    preview: ["🚀", "🛸", "👽", "🌟"] 
  },
  { 
    id: "vehicles", 
    name: "Vehicles", 
    icon: "🚗", 
    requiredScore: 20000, 
    requiredCoins: 350, 
    category: "Transport", 
    preview: ["🚗", "✈️", "🚂", "🚁"] 
  },
  { 
    id: "human", 
    name: "Human", 
    icon: "👩‍❤️‍👨", 
    requiredScore: 30000, 
    requiredCoins: 1500, 
    category: "Human", 
    preview: ["👶", "👩‍❤️‍👨", "🧑‍🎓", "👴🏼"] 
  },
];

export const CATEGORIES = ["Nature", "Animals", "Human", "Activities", "Fantasy", "Transport"];
