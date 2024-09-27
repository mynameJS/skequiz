import { useState } from 'react';
import { togglePlayingState } from '../../../../services/sketchRoomService';
import { updateGameRoomOptions } from '../../../../services/sketchRoomService';
import { GAME_RULE_OPTIONS } from '../../../../constant/gameRuleOptions';
import { GameRules } from '../../../../types/gameState/interface';
import { playSound } from '../../../../utils/playSound';
import styles from './CustomGameRule.module.scss';

interface CustomGameRuleProps {
  currentParticipantsLen: number;
  currentRoomId: string;
  currentPlayerLimit: number;
  currentWholeRound: number;
  currentDrawTimeLimit: number;
  isRoomOwner: boolean;
  ControlCustomGameRule: (state: boolean) => void;
  isPlaying: boolean;
}

const CustomGameRule = ({
  currentParticipantsLen,
  currentRoomId,
  currentPlayerLimit,
  currentWholeRound,
  currentDrawTimeLimit,
  isRoomOwner,
  ControlCustomGameRule,
  isPlaying,
}: CustomGameRuleProps) => {
  const [gameRules, setGameRules] = useState<GameRules>({
    players: currentPlayerLimit,
    rounds: currentWholeRound,
    timeLimit: currentDrawTimeLimit,
  });
  const { playerLimit, round, drawTimeLimit } = GAME_RULE_OPTIONS;

  // 게임 인원 설정 수가 현재 참여자 보다 커야하고, 최소 2명의 플레이어가 필요함
  const isPlayStartValid = currentParticipantsLen <= gameRules.players && currentParticipantsLen > 1;

  const handleIncrement = (key: keyof GameRules) => {
    playSound('selectOption');
    setGameRules(prevState => {
      const options = key === 'players' ? playerLimit : key === 'rounds' ? round : drawTimeLimit;

      const currentIndex = options.indexOf(prevState[key]);
      const newValue = currentIndex < options.length - 1 ? options[currentIndex + 1] : prevState[key];

      return { ...prevState, [key]: newValue };
    });
  };

  const handleDecrement = (key: keyof GameRules) => {
    playSound('selectOption');
    setGameRules(prevState => {
      const options = key === 'players' ? playerLimit : key === 'rounds' ? round : drawTimeLimit;

      const currentIndex = options.indexOf(prevState[key]);
      const newValue = currentIndex > 0 ? options[currentIndex - 1] : prevState[key];

      return { ...prevState, [key]: newValue };
    });
  };

  const handlePlayStartButtonClick = async () => {
    await updateGameRoomOptions(currentRoomId, gameRules);
    ControlCustomGameRule(false);
    await togglePlayingState(currentRoomId);
  };

  if (isPlaying) return null;

  return (
    <div className={styles.container}>
      {isRoomOwner ? (
        <>
          <div className={styles.option}>
            <div className={styles.label}>게임 인원</div>
            <div className={styles.control}>
              <button
                onClick={() => handleDecrement('players')}
                disabled={gameRules.players <= Math.min(...playerLimit)}>
                -
              </button>
              <span>{gameRules.players}</span>
              <button
                onClick={() => handleIncrement('players')}
                disabled={gameRules.players >= Math.max(...playerLimit)}>
                +
              </button>
            </div>
          </div>
          <div className={styles.option}>
            <div className={styles.label}>최대 라운드</div>
            <div className={styles.control}>
              <button onClick={() => handleDecrement('rounds')} disabled={gameRules.rounds <= Math.min(...round)}>
                -
              </button>
              <span>{gameRules.rounds}</span>
              <button onClick={() => handleIncrement('rounds')} disabled={gameRules.rounds >= Math.max(...round)}>
                +
              </button>
            </div>
          </div>
          <div className={styles.option}>
            <div className={styles.label}>출제 시간</div>
            <div className={styles.control}>
              <button
                onClick={() => handleDecrement('timeLimit')}
                disabled={gameRules.timeLimit <= Math.min(...drawTimeLimit)}>
                -
              </button>
              <span>{gameRules.timeLimit}</span>
              <button
                onClick={() => handleIncrement('timeLimit')}
                disabled={gameRules.timeLimit >= Math.max(...drawTimeLimit)}>
                +
              </button>
            </div>
          </div>
          <button className={styles.playButton} disabled={!isPlayStartValid} onClick={handlePlayStartButtonClick}>
            Play Start
          </button>
        </>
      ) : (
        <p className={styles.waitingGame}>Waiting for setting the game rules</p>
      )}
    </div>
  );
};

export default CustomGameRule;
