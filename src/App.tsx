import './index.css';
import { GameScreen } from './components/GameScreen';
import { MutationDialog } from './components/MutationDialog';
import { EndScreen } from './components/EndScreen';
import { useGameState } from './hooks/useGameState';

function App() {
  const {
    state,
    lastEvent,
    pendingMutation,
    expandBiomass,
    stimulateMutation,
    acceptMutation,
    rejectMutation,
    nextDay,
  } = useGameState();

  if (state.isGameOver) {
    return (
      <EndScreen
        level={state.level}
        day={state.day}
        maxDays={state.maxDays}
      />
    );
  }

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
        <MutationDialog
          mutation={pendingMutation}
          onAccept={acceptMutation}
          onReject={rejectMutation}
        />
      )}
    </>
  );
}

export default App;
