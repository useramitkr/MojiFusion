// game/achievements.ts
export type Achievement = {
  id: string;
  description: string;
  condition: (data: { score: number; merges: Record<number, number> }) => boolean;
  reward: { undo?: number; swap?: number };
};

export const achievements: Achievement[] = [
  {
    id: "merge10apples",
    description: "Merge 10 🍎 tiles",
    condition: ({ merges }) => (merges[2] || 0) >= 10,
    reward: { undo: 1, swap: 1 },
  },
  {
    id: "score10000",
    description: "Reach 10,000 score",
    condition: ({ score }) => score >= 10000,
    reward: { undo: 1, swap: 1 },
  },
  {
    id: "make2048",
    description: "Create the 2048 tile",
    condition: ({ merges }) => (merges[2048] || 0) >= 1,
    reward: { undo: 5, swap: 2 },
  },
];
