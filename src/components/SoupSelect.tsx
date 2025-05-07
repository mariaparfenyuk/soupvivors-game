import { SoupType } from '../game/soups';

type Props = {
  soups: SoupType[];
  onSelect: (soup: SoupType) => void;
};

export const SoupSelect = ({ soups, onSelect }: Props) => {
  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
{`
╭─ CHOOSE YOUR SOUP ───────────────────────────────╮
│  Select a soup base to begin microbial evolution │
╰──────────────────────────────────────────────────╯
`}
      {soups.map((soup, index) => (
        <div key={soup.id} style={{ marginBottom: '2rem' }}>
          <strong>[{index + 1}] {soup.name}</strong>
          <pre>{soup.asciiIcon}</pre>
          <div>{soup.description}</div>
          <button onClick={() => onSelect(soup)}>Select</button>
        </div>
      ))}
    </pre>
  );
};