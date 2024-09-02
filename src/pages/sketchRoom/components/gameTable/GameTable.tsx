import { useState, useEffect } from 'react';
import { DrawStartTime } from '../../../../types/gameState/interface';
import styles from './GameTable.module.scss';

interface GameTableProps {
  currentRound: number;
  wholeRound: number;
  currentSuggestedWord: string;
  drawStartTime: DrawStartTime;
  drawLimitTime: number;
  remainingTime: number;
  onUpdateRemainingTime: (second: number) => void;
  isMyTurn: boolean;
}

const GameTable = ({
  currentRound,
  wholeRound,
  currentSuggestedWord,
  drawStartTime,
  drawLimitTime,
  remainingTime,
  onUpdateRemainingTime,
  isMyTurn,
}: GameTableProps) => {
  const [displayedWord, setDisplayedWord] = useState<string>('');

  useEffect(() => {
    // 타이머 로직
    const startTime = new Date(drawStartTime.seconds * 1000 + drawStartTime.nanoseconds / 1000000).getTime();
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const timeLeft = drawLimitTime - elapsedTime;

      if (timeLeft <= 0) {
        clearInterval(interval);
        onUpdateRemainingTime(0);
      } else {
        onUpdateRemainingTime(timeLeft);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [drawStartTime, drawLimitTime, onUpdateRemainingTime]);

  // 시간 지나고 업데이트되기전에 결과창에서 제시어 노출될텐데
  // 그때 정답맞추는건 적용안되는거 고려해야됨
  useEffect(() => {
    // 제시어 표시 로직
    if (isMyTurn) {
      // 내 턴일 때는 제시어를 그대로 보여줌
      setDisplayedWord(currentSuggestedWord);
    } else {
      // 내 턴이 아닐 때
      if (remainingTime > 30) {
        setDisplayedWord('?'); // 처음에는 '?' 표시
      } else if (remainingTime <= 30 && remainingTime > 15) {
        // 30초 이하 15초 초과일 때 밑줄 표시
        setDisplayedWord('_ '.repeat(currentSuggestedWord.length).trim());
      } else if (remainingTime <= 15) {
        // 15초 이하일 때 중간 글자 하나 표시
        const middleIndex =
          currentSuggestedWord.length % 2 === 0
            ? Math.floor(currentSuggestedWord.length / 2) - 1
            : Math.floor(currentSuggestedWord.length / 2);

        const newDisplayedWord = currentSuggestedWord
          .split('')
          .map((char, index) => (index === middleIndex ? char : '_'))
          .join(' ');

        setDisplayedWord(newDisplayedWord);
      }
    }
  }, [remainingTime, isMyTurn, currentSuggestedWord]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.timer}>
          <p>Timer</p>
          <p>{remainingTime}</p>
        </div>
        <div className={styles.round}>
          Round {currentRound} of {wholeRound}
        </div>
      </div>
      <div className={styles.suggestedWordBox}>
        <p>제시어</p>
        <p>{displayedWord}</p>
      </div>
    </div>
  );
};

export default GameTable;
