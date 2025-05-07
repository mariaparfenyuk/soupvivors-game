import { useEffect, useState } from 'react';
import { GameState, LEVEL_REQUIREMENTS } from '../game/state';
import { Mutation, mutationPool } from '../game/mutations';
import { gameEvents } from '../game/events';
import { SoupType } from '../game/soups';

export const useGameState = (soup: SoupType) => {
  const [state, setState] = useState<GameState | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [pendingMutation, setPendingMutation] = useState<Mutation | null>(null);

  useEffect(() => {
    if (soup) {
      setState({
        level: 1,
        day: 1,
        xp: 0,
        soup: soup.name,
        stability: 50,
        mutations: [],
        maxDays: Math.floor(20 + Math.random() * 10),
        isGameOver: false,
        ...soup.initialResources,
      });
    }
  }, [soup]);

  const updateCivilizationLevel = (game: GameState): GameState => {
    const currentLevel = game.level;
    for (let level = 5; level > currentLevel; level--) {
      const req = LEVEL_REQUIREMENTS[level];
      if (game.xp >= req.xp && game.stability >= req.stability) {
        return { ...game, level };
      }
    }
    return game;
  };

  const expandBiomass = () => {
    if (!state || state.isGameOver) return;

    const shouldTriggerEvent = Math.random() < 0.3;
    const event = shouldTriggerEvent
      ? gameEvents[Math.floor(Math.random() * gameEvents.length)]
      : null;

    setState(prev => {
      if (!prev) return prev;

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

      const updated: GameState = {
        ...prev,
        xp: newXp,
        proteins: newProteins,
        carbs: newCarbs,
        stability: Math.max(Math.min(prev.stability + stabilityChange, 100), 0),
        day: prev.day + 1,
        oxygen: prev.oxygenBonus ? prev.oxygen + 5 : prev.oxygen,
      };

      const result = updateCivilizationLevel(event?.effect ? event.effect(updated) : updated);

      if (result.level === 5 || result.day > result.maxDays) {
        return { ...result, isGameOver: true };
      }

      return result;
    });

    if (event) {
      setLastEvent(event.description);
    }
  };

  const stimulateMutation = () => {
    if (!state || state.mutations.length >= 5 || pendingMutation || state.isGameOver) return;

    const remaining = mutationPool.filter(
      (m) => !state.mutations.includes(m.name)
    );
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setPendingMutation(random);
  };

  const acceptMutation = () => {
    if (!pendingMutation || !state) return;

    setState(prev => {
      if (!prev) return prev;
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
    if (!state || state.isGameOver) return;

    setState(prev => {
      if (!prev) return prev;

      let updated = { ...prev, day: prev.day + 1 };

      if (prev.oxygenBonus) {
        updated.oxygen += 5;
      }

      const shouldMutate = Math.random() < 0.12;
      if (shouldMutate) {
        const available = mutationPool.filter(m => !prev.mutations.includes(m.name));
        if (available.length > 0) {
          const mutation = available[Math.floor(Math.random() * available.length)];
          updated = mutation.apply(updated);
          updated.mutations = [...updated.mutations, mutation.name];
          setLastEvent('Spontaneous mutation: ' + mutation.name);
        }
      }

      const shouldTempEvent = Math.random() < 0.1;
      if (shouldTempEvent) {
        const tempEvents = [
          {
            description: 'Freezer spike reduced available oxygen.',
            effect: (s: GameState) => ({ ...s, oxygen: Math.max(s.oxygen - 10, 0) }),
          },
          {
            description: 'Fermentation boost enriched proteins.',
            effect: (s: GameState) => ({ ...s, proteins: s.proteins + 5 }),
          },
          {
            description: 'Cold shock destabilized membranes.',
            effect: (s: GameState) => ({ ...s, stability: Math.max(s.stability - 5, 0) }),
          },
          {
            description: 'Mild warming increased carbohydrate flow.',
            effect: (s: GameState) => ({ ...s, carbs: s.carbs + 5 }),
          },
        ];
        const event = tempEvents[Math.floor(Math.random() * tempEvents.length)];
        updated = event.effect(updated);
        setLastEvent(event.description);
      }

      if (updated.level === 5 || updated.day > updated.maxDays) {
        return { ...updated, isGameOver: true };
      }

      return updated;
    });
  };

  if (!state) return null;

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
