import { SoupType } from '../game/soups';

type Props = {
  soups: SoupType[];
  onSelect: (soup: SoupType) => void;
};

export const SoupSelect = ({ soups, onSelect }: Props) => {
  return (
    <pre style={{ fontFamily: 'monospace', padding: '1rem', whiteSpace: 'pre-wrap' }}>
{`
╭─ CHOOSE YOUR SOUP ─────────────────────────────╮
│  Select a soup base to begin microbial journey │
╰────────────────────────────────────────────────╯
`}
      {soups.map((soup, index) => (
        <div key={soup.id} style={{ marginBottom: '2rem' }}>
          <strong>[{index + 1}] {soup.name}</strong>
          <div>
            {soup.asciiIcon.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {soup.description}
          </div>
          <button onClick={() => onSelect(soup)}>Select</button>
        </div>
      ))}
    </pre>
  );
};
