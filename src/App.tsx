import './index.css';
import { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { MutationDialog } from './components/MutationDialog';
import { EndScreen } from './components/EndScreen';
import { SoupSelect } from './components/SoupSelect';
import { soups, SoupType } from './game/soups';
import { useGameState } from './hooks/useGameState';

function App() {
  const [selectedSoup, setSelectedSoup] = useState<SoupType | null>(null);

  const game = useGameState(selectedSoup);

  if (!selectedSoup) {
    return <SoupSelect soups={soups} onSelect={setSelectedSoup} />;
  }

  if (!game) return null;

  const {
    state,
    lastEvent,
    pendingMutation,
    expandBiomass,
    stimulateMutation,
    acceptMutation,
    rejectMutation,
    nextDay,
  } = game;

  if (state.isGameOver) {
    return (
      <EndScreen
        level={state.level}
        day={state.day}
        maxDays={state.maxDays}
        soup={state.soup}
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
