import { useState, useEffect } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import useGameState from './hook/useGameState';
import useGameStart from './hook/useGameStart';
import { userStore } from '../../store/userStore';
import { UserDataType } from '../../types/user/interface';
import { PlayGameState } from '../../types/gameState/interface';
import { DEFAULT_GAME_RULE_OPTIONS } from '../../constant/gameRuleOptions';
import palette from '../../assets/image/palette.png';
import Drawing from './components/drawing/Drawing';
import Participants from './components/participants/Participants';
import ChattingBox from './components/chatting/ChattingBox';
import GuideBoard from './components/guideBoard/GuideBoard';
import GameTable from './components/gameTable/GameTable';
import CustomGameRule from './components/customGameRule/CustomGameRule';
import styles from './SketchRoom.module.scss';

const SketchRoom = () => {
  const navigateTo = useNavigateClick();
  const { defaultPlayerLimit, defaultRound, defaultDrawTimeLimit } = DEFAULT_GAME_RULE_OPTIONS;
  const [participantList, setParticipantList] = useState<UserDataType[]>([]);
  const [playGameState, setPlayGameState] = useState<PlayGameState>({
    playerLimit: defaultPlayerLimit,
    currentDrawerIndex: 0,
    wholeRound: defaultRound,
    currentRound: 1,
    currentSuggestedWord: '',
    drawStartTime: { seconds: 0, nanoseconds: 0 },
    drawLimitTime: defaultDrawTimeLimit,
    isPlaying: false,
    isPublic: true,
    playingStep: 'waiting',
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
    isPublic,
    playingStep,
  } = playGameState;

  const [clearCanvasTrigger, setClearCanvasTrigger] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(drawLimitTime);
  const [isCustomGameRuleOpen, setIsCustomGameRuleOpen] = useState<boolean>(true);
  const [isGuideTurn, setIsGuideTurn] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<'lineDraw' | 'fill'>('lineDraw');
  const currentRoomId = userStore(state => state.roomId) ?? '';
  const currentUserId = userStore(state => state.id);
  const currentUserNickName = userStore(state => state.nickName);
  const currentParticipantsLen = participantList.length;
  const roomOwnerId = participantList.length > 0 ? participantList[0]?.id : '';
  const isRoomOwner = roomOwnerId === currentUserId;
  const isMyTurn = isPlaying && participantList[currentDrawerIndex]?.id === currentUserId;
  const isAnswer =
    participantList.length > 0 ? participantList.filter(userData => userData.id === currentUserId)[0]?.isAnswer : false;
  const isAllPass =
    participantList.length > 0
      ? participantList.filter(userData => userData.isAnswer).length === participantList.length - 1
      : false;
  const { nickName: currentDrawerNickName, id: currentDrawerId } = participantList[currentDrawerIndex] || {};
  const cursorClass = isMyTurn ? (drawMode === 'lineDraw' ? styles.lineDraw : styles.fill) : styles.default;

  const updateParticipantList = (newParticipantList: UserDataType[]) => {
    setParticipantList(newParticipantList);
  };

  const updateRemainingTime = (second: number) => {
    setRemainingTime(second);
  };

  const updateIsGuideTurn = (state: boolean) => {
    setIsGuideTurn(state);
  };

  const updateClearCanvasTrigger = () => {
    setClearCanvasTrigger(prevValue => !prevValue);
  };

  const ControlCustomGameRule = (state: boolean) => {
    setIsCustomGameRuleOpen(state);
  };

  const handleInviteLinkButton = async () => {
    const inviteLink = `https://skequiz.netlify.app/sketchRoom/${currentRoomId}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('초대링크 복사 완료 !');
    } catch (error) {
      console.error('Failed to copy text: ', error);
      alert('초대링크 복사에 실패했습니다.');
    }
  };

  useEffect(() => {
    // 새로고침 시 전역상태로 관리중인 유저정보가 초기화되고 바로 스케치룸에서 로비로 리다이렉트처리
    if (currentUserNickName === '') {
      navigateTo('/');
    }
  }, [currentUserNickName, navigateTo]);

  useGameStart({
    participantList,
    updateClearCanvasTrigger,
    updateIsGuideTurn,
    playingStep,
    currentRoomId,
    isRoomOwner,
    isAllPass,
    isPlaying: playGameState.isPlaying,
    currentSuggestedWord: playGameState.currentSuggestedWord,
    remainingTime,
    currentRound: playGameState.currentRound,
    currentDrawerId,
    isPublic,
    isCustomGameRuleOpen,
    ControlCustomGameRule,
  });
  useRoomData(currentRoomId, currentUserNickName, currentUserId, updateParticipantList);
  useGameState(currentRoomId, setPlayGameState);

  return (
    <div className={`${styles.container} ${cursorClass}`}>
      {participantList.length && (
        <div className={styles.gameBoard}>
          <div className={styles.logoBox}>
            <p
              onClick={() => {
                navigateTo('/');
              }}>
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
              playingStep={playingStep}
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
              <Drawing
                isMyTurn={isMyTurn}
                clearCanvasTrigger={clearCanvasTrigger}
                drawMode={drawMode}
                setDrawMode={setDrawMode}
              />
              {isGuideTurn && (
                <GuideBoard
                  participantList={participantList}
                  currentSuggestedWord={currentSuggestedWord}
                  currentDrawerNickName={currentDrawerNickName}
                  playingStep={playingStep}
                  isMyTurn={isMyTurn}
                  isPublic={isPublic}
                />
              )}
              {!isPublic && isCustomGameRuleOpen && (
                <CustomGameRule
                  currentParticipantsLen={currentParticipantsLen}
                  currentRoomId={currentRoomId}
                  currentPlayerLimit={playerLimit}
                  currentWholeRound={wholeRound}
                  currentDrawTimeLimit={drawLimitTime}
                  isRoomOwner={isRoomOwner}
                  ControlCustomGameRule={ControlCustomGameRule}
                  isPlaying={isPlaying}
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
              playingStep={playingStep}
            />
          </div>
          {!isPlaying && !isPublic && (
            <div className={styles.inviteBox}>
              <div className={styles.inviteCodeBox}>
                <button onClick={handleInviteLinkButton} className={styles.inviteCode}>
                  Copy Invite Link !
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SketchRoom;
