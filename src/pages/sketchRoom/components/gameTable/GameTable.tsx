import { useState, useEffect } from 'react';
import { UserDataType } from '../../../../types/user/interface';
import styles from './GameTable.module.scss';

interface GameTableProps {
  participantsList: UserDataType[];
}

const GameTable = ({ participantsList }: GameTableProps) => {
  console.log(participantsList);
  const totalRounds = 3; // 총 라운드 수
  const participants = participantsList.map(userData => userData.nickName);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [timeSecond, setTimeSecond] = useState<number>(1); // 기본 타이머 60초
  const [wordToDraw, setWordToDraw] = useState<string>(''); // 제시어 관리
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const wordsList = ['사과', '고양이', '자동차']; // 예시 제시어 목록

  // 다음 라운드로 넘어가는 함수
  const nextRound = () => {
    setTimeSecond(1); // 타이머 리셋

    // 현재 라운드의 마지막 참가자일 경우 다음 라운드로 넘어감
    if (currentPlayerIndex === participants.length - 1) {
      if (currentRound < totalRounds) {
        setCurrentRound(prevRound => prevRound + 1);
        setCurrentPlayerIndex(0); // 첫 번째 참가자로 돌아감
      } else {
        console.log('게임 종료');
        // 게임 종료 로직을 여기에 추가
        setGameStarted(false); // 게임 종료
        return;
      }
    } else {
      setCurrentPlayerIndex(prevIndex => prevIndex + 1); // 다음 참가자로 넘어감
    }

    setWordToDraw(wordsList[Math.floor(Math.random() * wordsList.length)]); // 랜덤으로 제시어 선택
  };

  // 게임 시작 시 초기 설정
  const handleStartGame = () => {
    setGameStarted(true);
    setWordToDraw(wordsList[Math.floor(Math.random() * wordsList.length)]); // 제시어 설정
  };

  useEffect(() => {
    if (!gameStarted) return;

    const timerInterval = setInterval(() => {
      setTimeSecond(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          nextRound(); // 타이머가 끝나면 다음 라운드로 이동
          return 60; // 타이머를 리셋
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
  }, [currentRound, currentPlayerIndex, gameStarted]);

  return (
    <div className={styles.gameTable}>
      {!gameStarted ? (
        <button onClick={handleStartGame}>게임 시작</button>
      ) : (
        <>
          <div className={styles.timerSection}>
            <h2>타이머</h2>
            <p>{timeSecond}s</p>
          </div>
          <div className={styles.roundSection}>
            <h2>
              Round {currentRound} / {totalRounds}
            </h2>
            <p>출제자: {participants[currentPlayerIndex]}</p>
          </div>
          <div className={styles.wordSection}>
            <h2>제시어</h2>
            <p>{wordToDraw}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GameTable;
