export type GameState = {
  day: number;
  stability: number;
  level: number;
  soup: string;
  proteins: number;
  carbs: number;
  spices: number;
  oxygen: number;
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
};

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Microorganisms',
  2: 'Colony',
  3: 'Community',
  4: 'Culture',
  5: 'Intelligence',
};
