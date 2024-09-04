import { useState, useEffect } from 'react';
import { userStore } from '../../../../store/userStore';
import { createRandomWordList } from '../../../../utils/createRandomWordList';
import { updateSuggestedWord, updateDrawStartTime } from '../../../../services/sketchRoomService';
import goldMedal from '../../../../assets/medal_gold.png';
import silverMedal from '../../../../assets/medal_silver.png';
import bronzeMedal from '../../../../assets/medal_bronze.png';
import { UserDataType } from '../../../../types/user/interface';
import { PlayingStepState } from '../../../../types/gameState/interface';
import styles from './GuideBoard.module.scss';

interface GuideBoardProps {
  participantList: UserDataType[];
  currentSuggestedWord: string;
  currentDrawerNickName: string;
  playingStep: PlayingStepState;
  isMyTurn: boolean;
  isAllStepsFalse: boolean;
}

interface GameResultProps {
  participantList: UserDataType[];
  currentSuggestedWord?: string;
}

interface WaitingSelectWordProps {
  currentDrawerNickName: string;
}

const GuideBoard = ({
  participantList,
  currentSuggestedWord,
  currentDrawerNickName,
  isMyTurn,
  playingStep,
  isAllStepsFalse,
}: GuideBoardProps) => {
  return (
    <div className={styles.container}>
      {isAllStepsFalse && <WaitingOtherPlayers />}

      {playingStep.selectWord &&
        (isMyTurn ? <SelectWord /> : <WaitingSelectWord currentDrawerNickName={currentDrawerNickName} />)}

      {playingStep.showResult && (
        <GameResult participantList={participantList} currentSuggestedWord={currentSuggestedWord} />
      )}

      {playingStep.showTotalResult && <TotalGameResult participantList={participantList} />}
    </div>
  );
};

export default GuideBoard;

const WaitingOtherPlayers = () => {
  return <p className={styles.waitingPlayer}>Waiting for other players</p>;
};

const SelectWord = () => {
  const currentRoomId = userStore(state => state.roomId) ?? '';
  const [randomWordList, setRandomWordList] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [autoSelectedWord, setAutoSelectedWord] = useState<string | null>(null);

  const handleWordClick = async (roomId: string, selectedWord: string) => {
    await updateSuggestedWord(roomId, selectedWord);
    await updateDrawStartTime(roomId);
  };

  useEffect(() => {
    // 랜덤 단어 리스트 생성
    const randomWordList = createRandomWordList();
    setRandomWordList(randomWordList);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          // 자동 선택할 단어 선택
          if (randomWordList.length > 0) {
            const randomIndex = Math.floor(Math.random() * randomWordList.length);
            const selectedWord = randomWordList[randomIndex];
            setAutoSelectedWord(selectedWord);
          }
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [randomWordList]);

  useEffect(() => {
    if (autoSelectedWord) {
      handleWordClick(currentRoomId, autoSelectedWord);
    }
  }, [autoSelectedWord, currentRoomId]);

  return (
    <div className={styles.selectWordContainer}>
      <div className={styles.guideMessage}>
        <p>{secondsLeft}</p>
        <p>그리고 싶은 단어를 선택하세요!</p>
      </div>
      <div className={styles.wordList}>
        {randomWordList.map(word => (
          <button key={word} className={styles.word} onClick={() => handleWordClick(currentRoomId, word)}>
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

const WaitingSelectWord = ({ currentDrawerNickName }: WaitingSelectWordProps) => {
  return (
    <div className={styles.waitingWord}>
      <p>출제자 : {currentDrawerNickName}</p>
      <p>단어를 고르고 있습니다</p>
    </div>
  );
};

const GameResult = ({ participantList, currentSuggestedWord }: GameResultProps) => {
  const sortedParticipantsByScore = participantList.sort((a, b) => b.score - a.score);

  return (
    <div className={styles.gameResultContainer}>
      <p>정답 : {currentSuggestedWord}</p>
      <div className={styles.resultList}>
        {sortedParticipantsByScore.map((participant, index) => (
          <div key={participant.id} className={styles.participantItem}>
            {index === 0 && <img src={goldMedal} alt="Gold Medal" />}
            {index === 1 && <img src={silverMedal} alt="Silver Medal" />}
            {index === 2 && <img src={bronzeMedal} alt="Bronze Medal" />}
            <p>
              {index >= 3 && `${index + 1}. `}
              {participant.nickName} : {participant.score} point.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TotalGameResult = ({ participantList }: GameResultProps) => {
  const sortedParticipantsByTotalScore = participantList.sort((a, b) => b.totalScore - a.totalScore);
  return (
    <div className={styles.gameResultContainer}>
      <p>전체 라운드 결과</p>
      <div className={styles.resultList}>
        {sortedParticipantsByTotalScore.map((participant, index) => (
          <div key={participant.id} className={styles.participantItem}>
            {index === 0 && <img src={goldMedal} alt="Gold Medal" />}
            {index === 1 && <img src={silverMedal} alt="Silver Medal" />}
            {index === 2 && <img src={bronzeMedal} alt="Bronze Medal" />}
            <p>
              {index >= 3 && `${index + 1}. `}
              {participant.nickName} : {participant.totalScore} point.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
