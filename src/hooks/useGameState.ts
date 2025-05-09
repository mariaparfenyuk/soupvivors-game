import { useEffect, useState } from 'react';
import { GameState } from '../game/state';
import { Mutation, mutationPool } from '../game/mutations';
import { gameEvents, temperatureEvents } from '../game/events';
import { SoupType } from '../game/soups';
import {
  updateCivilizationLevel,
  applyStabilityChange,
  applyEvent,
  isGameOver,
  applyMutation,
} from '../game/logic';
import { randomItem } from '../game/utils';

export const useGameState = (soup: SoupType) => {
  const [state, setState] = useState<GameState | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [pendingMutation, setPendingMutation] = useState<Mutation | null>(null);

  const logEvent = (text: string | null) => {
    if (text) setLastEvent(text);
  };

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

  const expandBiomass = () => {
    if (!state || state.isGameOver) return;

    const shouldTriggerEvent = Math.random() < 0.3;
    const event = shouldTriggerEvent ? randomItem(gameEvents) : undefined;

    setState(prev => {
      if (!prev) return prev;

      let updated = {
        ...prev,
        xp: prev.xp + 5 + (prev.xpBoost ? 1 : 0),
        proteins: Math.max(prev.proteins - 5, 0),
        carbs: Math.max(prev.carbs - 5, 0),
        day: prev.day + 1,
        oxygen: prev.oxygenBonus ? prev.oxygen + 5 : prev.oxygen,
      };

      updated = applyStabilityChange(updated);
      updated = applyEvent(updated, event ?? null);
      updated = updateCivilizationLevel(updated);

      if (event?.description) {
        logEvent(event.description);
      }

      return isGameOver(updated) ? { ...updated, isGameOver: true } : updated;
    });
  };

  const stimulateMutation = () => {
    if (!state || state.mutations.length >= 5 || pendingMutation || state.isGameOver) return;

    const remaining = mutationPool.filter(
      (m) => !state.mutations.includes(m.name)
    );
    const random = randomItem(remaining);
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

    logEvent(`Mutation acquired: ${pendingMutation.name}`);
    setPendingMutation(null);
  };

  const rejectMutation = () => {
    logEvent('Mutation rejected.');
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

      const availableMutations = mutationPool.filter(m => !prev.mutations.includes(m.name));
      if (Math.random() < 0.12 && availableMutations.length) {
        const mutation = randomItem(availableMutations);
        updated = applyMutation(updated, mutation);
        logEvent(`Spontaneous mutation: ${mutation.name}`);
      }

      if (Math.random() < 0.1) {
        const event = randomItem(temperatureEvents);
        updated = applyEvent(updated, event);
        logEvent(event.description);
      }

      updated = updateCivilizationLevel(updated);
      return isGameOver(updated) ? { ...updated, isGameOver: true } : updated;
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
