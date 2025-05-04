import { LEVEL_NAMES } from '../game/state';

type Props = {
  level: number;
  day: number;
  maxDays: number;
};

export const EndScreen = ({ level, day, maxDays }: Props) => {
  const getEndingPhrase = (): string => {
    if (level === 5) {
      return "Congratulations! Intelligence has emerged from broth!";
    }

    const phrasesByLevel: Record<number, string[]> = {
      1: [
        "You were still a droplet of potential.",
        "The spoon took you before you could divide.",
        "So much soup, so little time.",
      ],
      2: [
        "Your colony had dreams... but no membrane.",
        "Another spoon, another failure.",
        "Not bad. For a microbe.",
      ],
      3: [
        "Your community almost found its voice.",
        "Just one spice short of genius.",
        "Broth betrayed you at the brink.",
      ],
      4: [
        "Culture collapsed. Great soup civilizations fall too.",
        "So close. But the refrigerator claimed all.",
        "Your thoughts fermented... but not enough.",
      ],
    };

    const options = phrasesByLevel[level] || ["You existed. And then... you didn't."];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
{`
╭─ END OF EXPERIMENT ───────────────────────────────╮
│                                                   │
│  ${getEndingPhrase()}                            │
│                                                   │
│  Final Level: ${level} (${LEVEL_NAMES[level]})              │
│  Total Days:  ${day} / ${maxDays}                            │
╰──────────────────────────────────────────────────╯
`}
    </pre>
  );
};
