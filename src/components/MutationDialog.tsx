import { Mutation } from '../game/mutations';

type Props = {
  mutation: Mutation;
  onAccept: () => void;
  onReject: () => void;
};

export const MutationDialog = ({ mutation, onAccept, onReject }: Props) => {
  return (
    <div className="mutation-popup" style={{
      fontFamily: 'monospace',
      background: '#111',
      color: '#aaffaa',
      border: '1px solid #444',
      padding: '1rem',
      margin: '1rem',
    }}>
      <strong>Mutation Detected:</strong> {mutation.name}
      <p>{mutation.description}</p>
      <button onClick={onAccept}>[Accept]</button>
      <button onClick={onReject}>[Reject]</button>
    </div>
  );
};
