import { GameState, LEVEL_NAMES } from '../game/state';

type Props = {
  state: GameState;
  lastEvent: string | null;
  onExpandBiomass: () => void;
  onNextDay: () => void;
  onStimulateMutation: () => void;
};

export const GameScreen = ({ state, lastEvent, onExpandBiomass, onNextDay, onStimulateMutation, }: Props) => {
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
${formattedEvent}
╭─ Available Actions ─────────────╮
│ [1] Expand Biomass              │
│ [2] Stimulate Mutation          │
╰─────────────────────────────────╯
`}
      <button onClick={onExpandBiomass}>[1] Expand Biomass</button>
      <button onClick={onStimulateMutation}>[2] Stimulate Mutation</button>
      <button onClick={onNextDay}>Next Day</button>
{`
──────────────────────────────────────────────────────
Microbial Observation Interface v0.1-beta
Institute of Soupvivalism ©
`}
    </pre>
  );
};
