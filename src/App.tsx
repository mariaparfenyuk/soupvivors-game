import { useState } from 'react';
import './index.css';
import { GameState, initialGameState, LEVEL_REQUIREMENTS } from './game/state';
import { gameEvents } from './game/events';
import { GameScreen } from './components/GameScreen';
import { mutationPool, Mutation } from './game/mutations';

function App() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [pendingMutation, setPendingMutation] = useState<Mutation | null>(null);

  const stimulateMutation = () => {
    if (state.mutations.length >= 5) {
      setLastEvent('Mutation limit reached. No further mutations possible.');
      return;
    }
  
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
    setState(prev => ({
      ...prev,
      day: prev.day + 1,
    }));
  };

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
    const shouldTriggerEvent = Math.random() < 0.3;
    const event = shouldTriggerEvent
      ? gameEvents[Math.floor(Math.random() * gameEvents.length)]
      : null;
  
    setState((prev: GameState) => {
      const newXp = prev.xp + 5;
      const newProteins = Math.max(prev.proteins - 5, 0);
      const newCarbs = Math.max(prev.carbs - 5, 0);
  
      let stabilityChange = 0;
      if (newProteins < 20 || newCarbs < 20) {
        stabilityChange = -5;
      } else if (newProteins > 50 && newCarbs > 50) {
        stabilityChange = +5;
      }
  
      const updated = {
        ...prev,
        xp: newXp,
        proteins: newProteins,
        carbs: newCarbs,
        stability: Math.max(Math.min(prev.stability + stabilityChange, 100), 0),
        day: prev.day + 1,
      };
  
      const final = event ? event.effect(updated) : updated;
      return updateCivilizationLevel(final);
    });
  
    setLastEvent(event?.description || null);
  };
  
  return (
    <>
      <GameScreen
        state={state}
        lastEvent={lastEvent}
        onExpandBiomass={expandBiomass}
        onStimulateMutation={stimulateMutation}
        onNextDay={nextDay}
      />
      {pendingMutation && (
        <div className="mutation-popup" style={{
          fontFamily: 'monospace',
          background: '#111',
          color: '#aaffaa',
          border: '1px solid #444',
          padding: '1rem',
          margin: '1rem',
        }}>
          <strong>Mutation Detected:</strong> {pendingMutation.name}
          <p>{pendingMutation.description}</p>
          <button onClick={acceptMutation}>[Accept]</button>
          <button onClick={rejectMutation}>[Reject]</button>
        </div>
      )}
    </>
  );
}

export default App;
