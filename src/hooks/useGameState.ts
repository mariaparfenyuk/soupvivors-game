import { useState } from 'react';
import { GameState, initialGameState, LEVEL_REQUIREMENTS } from '../game/state';
import { Mutation, mutationPool } from '../game/mutations';
import { gameEvents } from '../game/events';

export const useGameState = () => {
  const [state, setState] = useState<GameState>(initialGameState);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [pendingMutation, setPendingMutation] = useState<Mutation | null>(null);

  const updateCivilizationLevel = (state: GameState): GameState => {
    const currentLevel = state.level;

    for (let level = 5; level > currentLevel; level--) {
      const req = LEVEL_REQUIREMENTS[level];
      if (state.xp >= req.xp && state.stability >= req.stability) {
        return { ...state, level };
      }
    }

    return state;
  };

  const expandBiomass = () => {
    if (state.isGameOver) return;

    const shouldTriggerEvent = Math.random() < 0.3;
    const event = shouldTriggerEvent
      ? gameEvents[Math.floor(Math.random() * gameEvents.length)]
      : null;

    setState((prev) => {
      const baseXp = 5;
      const bonusXp = prev.xpBoost ? 1 : 0;
      const newXp = prev.xp + baseXp + bonusXp;

      const newProteins = Math.max(prev.proteins - 5, 0);
      const newCarbs = Math.max(prev.carbs - 5, 0);

      let stabilityChange = 0;
      if (newProteins < 20 || newCarbs < 20) {
        stabilityChange = -5;
      } else if (newProteins > 50 && newCarbs > 50) {
        stabilityChange = +5;
      }

      if (prev.spiceSynergy && prev.spices > 0) {
        stabilityChange += 3;
      }
      

      const updated = {
        ...prev,
        xp: newXp,
        proteins: newProteins,
        carbs: newCarbs,
        stability: Math.max(Math.min(prev.stability + stabilityChange, 100), 0),
        day: prev.day + 1,
      };

      if (prev.oxygenBonus) {
        updated.oxygen += 5;
      }

      const final = event ? event.effect(updated) : updated;

      const leveled = updateCivilizationLevel(final);

      if (leveled.level === 5 || leveled.day > leveled.maxDays) {
        return { ...leveled, isGameOver: true };
      }

      return leveled;
    });

    setLastEvent(event?.description || null);
  };

  const stimulateMutation = () => {
    if (state.mutations.length >= 5 || pendingMutation || state.isGameOver) return;

    const remaining = mutationPool.filter(
      (m) => !state.mutations.includes(m.name)
    );
    const random = remaining[Math.floor(Math.random() * remaining.length)];

    setPendingMutation(random);
  };

  const acceptMutation = () => {
    if (!pendingMutation) return;

    setState((prev) => {
      const updated = pendingMutation.apply(prev);
      return {
        ...updated,
        mutations: [...prev.mutations, pendingMutation.name],
      };
    });

    setLastEvent(`Mutation acquired: ${pendingMutation.name}`);
    setPendingMutation(null);
  };

  const rejectMutation = () => {
    setLastEvent('Mutation rejected.');
    setPendingMutation(null);
  };

  const nextDay = () => {
    if (state.isGameOver) return;
  
    setState((prev) => {
      const updated = {
        ...prev,
        day: prev.day + 1,
      };
  
      if (updated.level === 5 || updated.day > prev.maxDays) {
        return { ...updated, isGameOver: true };
      }
  
      const shouldMutateSpontaneously = Math.random() < 0.12;
  
      if (shouldMutateSpontaneously) {
        const available = mutationPool.filter(
          (m) => !prev.mutations.includes(m.name)
        );
  
        if (available.length > 0) {
          const mutation = available[Math.floor(Math.random() * available.length)];
          const updatedWithMutation = mutation.apply(updated);
  
          setLastEvent('Spontaneous mutation: ' + mutation.name);
  
          return {
            ...updatedWithMutation,
            mutations: [...updatedWithMutation.mutations, mutation.name],
            isGameOver:
              updatedWithMutation.level === 5 ||
              updatedWithMutation.day > prev.maxDays,
          };
        }
      }
      if (prev.oxygenBonus) {
        updated.oxygen += 5;
      }
      return updated;
    });
  };
  

  return {
    state,
    lastEvent,
    pendingMutation,
    expandBiomass,
    stimulateMutation,
    acceptMutation,
    rejectMutation,
    nextDay,
  };
};
