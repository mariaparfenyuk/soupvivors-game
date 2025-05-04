export type GameState = {
  day: number;
  stability: number; // 0–100
  level: number; // 1–5
  soup: string;
  proteins: number;
  carbs: number;
  spices: number;
  oxygen: number;
  xp: number; 
  mutations: string[];
};

export const initialGameState: GameState = {
  day: 1,
  stability: 60,
  level: 1,
  soup: "Borscht",
  proteins: 60,
  carbs: 40,
  spices: 20,
  oxygen: 80,
  xp: 0, 
  mutations: [],
};

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Microorganisms',
  2: 'Colony',
  3: 'Community',
  4: 'Culture',
  5: 'Intelligence',
};

export const LEVEL_REQUIREMENTS: Record<number, { xp: number; stability: number }> = {
  2: { xp: 10, stability: 30 },
  3: { xp: 25, stability: 50 },
  4: { xp: 40, stability: 65 },
  5: { xp: 60, stability: 80 },
};
