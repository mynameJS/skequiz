import { useState, useEffect } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import useGameState from './hook/useGameState';
import useGameStart from './hook/useGameStart';
import { userStore } from '../../store/userStore';
import { UserDataType } from '../../types/user/interface';
import { PlayGameState, PlayingStepState } from '../../types/gameState/interface';
import palette from '../../assets/image/palette.png';
import Drawing from './components/drawing/Drawing';
import Participants from './components/participants/Participants';
import ChattingBox from './components/chatting/ChattingBox';
import GuideBoard from './components/guideBoard/GuideBoard';
import GameTable from './components/gameTable/GameTable';
import styles from './SketchRoom.module.scss';

const SketchRoom = () => {
  const navigateTo = useNavigateClick();
  const [participantList, setParticipantList] = useState<UserDataType[]>([]);
  const [playGameState, setPlayGameState] = useState<PlayGameState>({
    playerLimit: 3,
    currentDrawerIndex: 0,
    wholeRound: 3,
    currentRound: 1,
    currentSuggestedWord: '',
    drawStartTime: { seconds: 0, nanoseconds: 0 },
    drawLimitTime: 90,
    isPlaying: false,
  });
  const {
    playerLimit,
    currentDrawerIndex,
    wholeRound,
    currentRound,
    currentSuggestedWord,
    drawStartTime,
    drawLimitTime,
    isPlaying,
  } = playGameState;
  const [clearCanvasTrigger, setClearCanvasTrigger] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(drawLimitTime);
  const [isGuideTurn, setIsGuideTurn] = useState<boolean>(false);
  const [playingStep, setPlayingStep] = useState<PlayingStepState>({
    selectWord: false,
    nowDrawing: false,
    showResult: false,
    showTotalResult: false,
  });

  const currentRoomId = userStore(state => state.roomId) ?? '';
  const currentUserId = userStore(state => state.id);
  const currentUserNickName = userStore(state => state.nickName);
  const currentParticipantListLength = participantList.length;
  const roomOwnerId = participantList.length > 0 ? participantList[0]?.id : '';
  const isRoomOwner = roomOwnerId === currentUserId;
  const isMyTurn = isPlaying && participantList[currentDrawerIndex]?.id === currentUserId;
  const isAnswer =
    participantList.length > 0 ? participantList.filter(userData => userData.id === currentUserId)[0]?.isAnswer : false;
  const isAllPass =
    participantList.length > 0
      ? participantList.filter(userData => userData.isAnswer).length === participantList.length - 1
      : false;
  const isAllStepsFalse =
    !playingStep.selectWord && !playingStep.nowDrawing && !playingStep.showResult && !playingStep.showTotalResult;
  const { nickName: currentDrawerNickName, id: currentDrawerId } = participantList[currentDrawerIndex] || {};

  const updateParticipantList = (newParticipantList: UserDataType[]) => {
    setParticipantList(newParticipantList);
  };

  const updateRemainingTime = (second: number) => {
    setRemainingTime(second);
  };

  const updatePlayingStep = (stepName: keyof PlayingStepState, reset: boolean = false) => {
    setPlayingStep({
      selectWord: reset ? false : stepName === 'selectWord',
      nowDrawing: reset ? false : stepName === 'nowDrawing',
      showResult: reset ? false : stepName === 'showResult',
      showTotalResult: reset ? false : stepName === 'showTotalResult',
    });
  };

  const updateIsGuideTurn = (state: boolean) => {
    setIsGuideTurn(state);
  };

  const updateClearCanvasTrigger = () => {
    setClearCanvasTrigger(prevValue => !prevValue);
  };

  useEffect(() => {
    // 새로고침 시 전역상태로 관리중인 유저정보가 초기화되고 바로 스케치룸에서 로비로 리다이렉트처리
    if (currentUserNickName === '') {
      navigateTo('/');
    }
  }, [currentUserNickName, navigateTo]);

  useGameStart({
    participantList,
    updatePlayingStep,
    updateClearCanvasTrigger,
    updateIsGuideTurn,
    playingStep,
    currentRoomId,
    isRoomOwner,
    isAllPass,
    isAllStepsFalse,
    isPlaying: playGameState.isPlaying,
    currentSuggestedWord: playGameState.currentSuggestedWord,
    remainingTime,
    currentRound: playGameState.currentRound,
    currentDrawerId,
  });
  useRoomData(currentRoomId, currentUserNickName, currentUserId, updateParticipantList, currentParticipantListLength);
  useGameState(currentRoomId, setPlayGameState);

  return (
    <div className={styles.container}>
      {participantList.length && (
        <div className={styles.gameBoard}>
          <div
            className={styles.logoBox}
            onClick={() => {
              navigateTo('/');
            }}>
            <p>
              <span>S</span>
              <span>K</span>
              <span>E</span>
              <span>Q</span>
              <span>U</span>
              <span>I</span>
              <span>Z</span>
              <img src={palette} alt="팔레트" />
            </p>
          </div>
          <div className={styles.header}>
            <GameTable
              currentRound={currentRound}
              wholeRound={wholeRound}
              currentSuggestedWord={currentSuggestedWord}
              drawStartTime={drawStartTime}
              drawLimitTime={drawLimitTime}
              remainingTime={remainingTime}
              onUpdateRemainingTime={updateRemainingTime}
              isMyTurn={isMyTurn}
              isSelectWordTime={playingStep.selectWord}
            />
          </div>
          <div className={styles.playArea}>
            <div className={styles.participants}>
              <div className={styles.playerLimit}>
                <p>Players</p>
                <p>
                  ({participantList.length} / {playerLimit})
                </p>
              </div>
              {participantList.map(({ id, nickName, totalScore, isAnswer }) => (
                <Participants
                  key={id}
                  nickName={nickName}
                  userId={id}
                  currentUserId={currentUserId}
                  roomOwnerId={roomOwnerId}
                  currentDrawerId={currentDrawerId}
                  isPlaying={isPlaying}
                  isAnswer={isAnswer}
                  totalScore={totalScore}
                />
              ))}
            </div>
            <div className={styles.canvas}>
              <Drawing isMyTurn={isMyTurn} clearCanvasTrigger={clearCanvasTrigger} />
              {isGuideTurn && (
                <GuideBoard
                  participantList={participantList}
                  currentSuggestedWord={currentSuggestedWord}
                  currentDrawerNickName={currentDrawerNickName}
                  playingStep={playingStep}
                  isMyTurn={isMyTurn}
                  isAllStepsFalse={isAllStepsFalse}
                />
              )}
            </div>
            <ChattingBox
              currentRoomId={currentRoomId}
              currentUserNickName={currentUserNickName}
              currentUserId={currentUserId}
              currentSuggestedWord={currentSuggestedWord}
              isMyTurn={isMyTurn}
              drawLimitTime={drawLimitTime}
              remainingTime={remainingTime}
              isAnswer={isAnswer}
              nowDrawing={playingStep.nowDrawing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SketchRoom;
