export type GameEvent = {
  description: string;
  effect: (state: any) => any;
};

export const gameEvents: GameEvent[] = [
  {
    description: "A spoon disturbed the broth.",
    effect: (state) => ({
      ...state,
      stability: Math.max(state.stability - 10, 0),
      proteins: Math.max(state.proteins - 5, 0),
    }),
  },
  {
    description: "The broth has matured overnight.",
    effect: (state) => ({
      ...state,
      carbs: state.carbs + 5,
      stability: Math.min(state.stability + 5, 100),
    }),
  },
  {
    description: "Spices dissolved more evenly than expected.",
    effect: (state) => ({
      ...state,
      spices: state.spices + 10,
    }),
  },
  {
    description: "Refrigerator temperature dropped.",
    effect: (state) => ({
      ...state,
      oxygen: Math.max(state.oxygen - 5, 0),
    }),
  },
  {
    description: "Nothing unusual happened.",
    effect: (state) => ({ ...state }),
  },
];

export const temperatureEvents: GameEvent[] = [
  {
    description: 'Freezer spike reduced oxygen.',
    effect: (state) => ({ ...state, oxygen: Math.max(state.oxygen - 10, 0) }),
  },
  {
    description: 'Fermentation boost enriched proteins.',
    effect: (state) => ({ ...state, proteins: state.proteins + 5 }),
  },
  {
    description: 'Cold shock destabilized membranes.',
    effect: (state) => ({ ...state, stability: Math.max(state.stability - 5, 0) }),
  },
  {
    description: 'Mild warming increased carbohydrate flow.',
    effect: (state) => ({ ...state, carbs: state.carbs + 5 }),
  },
];
