import { useState } from 'react';
import './index.css';
import { GameState, initialGameState, LEVEL_NAMES } from './game/state';

function App() {
  const [state, setState] = useState<GameState>(initialGameState);

  const nextDay = () => {
    setState(prev => ({
      ...prev,
      day: prev.day + 1,
    }));
  };

  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
{`
╭─ Welcome to Soupvivors ─────────────────────────────╮
│  You are a bacterial lifeform inside a bowl of      │
│  soup. Survive, evolve, and become intelligent       │
│  before the host discards you.                      │
╰─────────────────────────────────────────────────────╯

┌───────────────────────────────┐
│       SOUPVIVORS REPORT       │
│      Specimen: ${state.soup.padEnd(18)}│
│      Day: ${state.day.toString().padEnd(23)}│
└───────────────────────────────┘

Civilization Level: ${LEVEL_NAMES[state.level]}
Stability: ${state.stability}%

Resources:
- Proteins: ${state.proteins}
- Carbs:    ${state.carbs}
- Spices:   ${state.spices}
- Oxygen:   ${state.oxygen}

[ Next Day ]
`}
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
