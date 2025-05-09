import { LEVEL_NAMES } from '../game/state';
import { defeatMessages, victoryMessages } from '../game/finalMessages';

type Props = {
  level: number;
  day: number;
  maxDays: number;
  soup: string;
  stability: number;
};

export const EndScreen = ({ level, day, maxDays, soup, stability }: Props) => {
  const isVictory = level === 5;

  const message = isVictory
    ? randomItem(victoryMessages)
    : randomItem(defeatMessages[level] || ["The soup had other plans."]);

  const heading = isVictory
    ? `
╭────────────────────────────────╮
│     🎉 CONGRATULATIONS 🎉     │
╰────────────────────────────────╯
`
    : `
╭────────────────────────────╮
│         GAME OVER          │
╰────────────────────────────╯
`;

  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
{heading}
{`
🥣 Soup:         ${soup}
📈 Level:        ${LEVEL_NAMES[level]}
📆 Day:          ${day} of ${maxDays}
🧪 Stability:    ${stability}%

${message}
`}
</pre>)
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
