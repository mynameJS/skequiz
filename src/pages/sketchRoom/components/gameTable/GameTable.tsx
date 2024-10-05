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
  playingStep: string;
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
  playingStep,
}: GameTableProps) => {
  const [displayedWord, setDisplayedWord] = useState<string>('?');

  useEffect(() => {
    if (!drawStartTime || drawStartTime.seconds === 0) return; // drawStartTime이 유효하지 않으면 실행하지 않음

    // selectWord 단계일때는 시간 drawLimitTime 으로고정
    if (playingStep === 'selectWord') {
      onUpdateRemainingTime(drawLimitTime);
      return;
    }

    const startTime = new Date(drawStartTime.seconds * 1000 + drawStartTime.nanoseconds / 1000000).getTime();

    const interval = setInterval(() => {
      const currentTime = Date.now(); // 현재 시간
      const elapsedTime = Math.floor((currentTime - startTime) / 1000); // 경과 시간(초)
      const timeLeft = drawLimitTime - elapsedTime;

      if (timeLeft <= 0) {
        clearInterval(interval);
        onUpdateRemainingTime(0); // 남은 시간이 0 이하가 되면 0으로 설정
      } else {
        onUpdateRemainingTime(timeLeft); // 남은 시간을 업데이트
      }
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 또는 drawStartTime 변경 시 타이머 정리
  }, [drawStartTime, drawLimitTime, onUpdateRemainingTime, playingStep]);

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
