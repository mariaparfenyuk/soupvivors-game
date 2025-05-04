import { useState } from 'react';
import './index.css';
import { GameState, initialGameState, LEVEL_NAMES, LEVEL_REQUIREMENTS } from './game/state';
import { gameEvents } from './game/events';

function App() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

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
  
  const formattedEvent = lastEvent ? `\nRecent Event:\n> ${lastEvent}\n` : '';
  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
  {`
  ╭─ Welcome to Soupvivors ─────────────────────────────╮
  │  You are a bacterial lifeform inside a bowl of      │
  │  soup. Survive, evolve, and become intelligent      │
  │  before the host discards you.                      │
  ╰─────────────────────────────────────────────────────╯
  
  ┌───────────────────────────────┐
  │       SOUPVIVORS REPORT       │
  │   Specimen: ${state.soup.padEnd(18)}│
  │   Day: ${state.day.toString().padEnd(23)}│
  └───────────────────────────────┘
  
  Civilization Level: ${LEVEL_NAMES[state.level]}
  Stability: ${state.stability}%
  Evolution XP: ${state.xp}
  
  Resources:
  - Proteins: ${state.proteins}
  - Carbs:    ${state.carbs}
  - Spices:   ${state.spices}
  - Oxygen:   ${state.oxygen}
  `}
  {formattedEvent}
  {`
  ╭─ Available Actions ─────────────╮
  │ [1] Expand Biomass              │
  ╰─────────────────────────────────╯
  `}
      <button onClick={expandBiomass}>[1] Expand Biomass</button>
      <button onClick={nextDay}>Next Day</button>
  {`
  ──────────────────────────────────────────────────────
  Microbial Observation Interface v0.1-beta
  Institute of Soupvivalism ©
  `}
    </pre>
  );
}

export default App;
