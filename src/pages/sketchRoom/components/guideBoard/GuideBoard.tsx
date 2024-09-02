import { useState, useEffect } from 'react';
import { userStore } from '../../../../store/userStore';
import { createRandomWordList } from '../../../../utils/createRandomWordList';
import { updateSuggestedWord } from '../../../../services/sketchRoomService';
import goldMedal from '../../../../assets/medal_gold.png';
import silverMedal from '../../../../assets/medal_silver.png';
import bronzeMedal from '../../../../assets/medal_bronze.png';
import styles from './GuideBoard.module.scss';
import { UserDataType } from '../../../../types/user/interface';

interface GuideBoardProps {
  currentViewGuideBoard: string;
  participantList: UserDataType[];
  currentSuggestedWord: string;
}

interface GameResultProps {
  participantList: UserDataType[];
  currentSuggestedWord?: string;
}

const GuideBoard = ({ currentViewGuideBoard, participantList, currentSuggestedWord }: GuideBoardProps) => {
  // if (!isGuideTurn) return null;

  return (
    <div className={styles.container}>
      {/* <WaitingOtherPlayers /> */}
      {/* <SelectWord /> */}
      {/* <WaitingSelectWord /> */}
      <GameResult participantList={participantList} currentSuggestedWord={currentSuggestedWord} />
      {/* <TotalGameResult participantList={participantList} /> */}
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

  const handleWordClick = async (roomId: string, selectedWord: string) => {
    updateSuggestedWord(roomId, selectedWord);
  };

  useEffect(() => {
    const randomWordList = createRandomWordList();
    setRandomWordList(randomWordList);
  }, []);

  return (
    <div className={styles.selectWordContainer}>
      <p>그리고 싶은 단어를 선택하세요 !</p>
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

const WaitingSelectWord = () => {
  return <p className={styles.waitingWord}>출제자가 단어를 고르고 있습니다</p>;
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
              {participant.nickName} : {participant.score} point.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
