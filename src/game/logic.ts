import { GameState, LEVEL_REQUIREMENTS } from './state';
import { GameEvent } from './events';
import { Mutation } from './mutations';

export function applyStabilityChange(state: GameState): GameState {
  let stability = state.stability;

  if (state.proteins < 20 || state.carbs < 20) {
    stability -= 5;
  } else if (state.proteins > 50 && state.carbs > 50) {
    stability += 5;
  }

  if (state.spiceSynergy && state.spices > 0) {
    stability += 3;
  }

  return { ...state, stability: Math.max(Math.min(stability, 100), 0) };
}

export function updateCivilizationLevel(state: GameState): GameState {
  for (let level = 5; level > state.level; level--) {
    const req = LEVEL_REQUIREMENTS[level];
    if (state.xp >= req.xp && state.stability >= req.stability) {
      return { ...state, level };
    }
  }
  return state;
}

export function applyEvent(state: GameState, event: GameEvent | null): GameState {
  return event?.effect ? event.effect(state) : state;
}

export function applyMutation(state: GameState, mutation: Mutation): GameState {
  const updated = mutation.apply(state);
  return {
    ...updated,
    mutations: [...state.mutations, mutation.name],
  };
}

export function isGameOver(state: GameState): boolean {
  return state.level === 5 || state.day > state.maxDays;
}
