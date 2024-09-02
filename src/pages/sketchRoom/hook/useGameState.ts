import { useEffect } from 'react';
import { getPlayGameState } from '../../../services/sketchRoomService';
import { PlayGameState } from '../../../types/gameState/interface';

const useGameState = (currentRoomId: string, updateGameState: (newGameState: PlayGameState) => void) => {
  useEffect(() => {
    getPlayGameState(currentRoomId, updateGameState);
  }, [currentRoomId]);
};

export default useGameState;
