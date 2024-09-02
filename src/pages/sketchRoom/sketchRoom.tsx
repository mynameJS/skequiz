import { useState, useEffect } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import useGameState from './hook/useGameState';
import { userStore } from '../../store/userStore';
import { sendChattingMessage, togglePlayingState } from '../../services/sketchRoomService';
import { MessageListTuple } from '../../types/chatting/type';
import { UserDataType } from '../../types/user/interface';
import { PlayGameState } from '../../types/gameState/interface';
import palette from '../../assets/palette.png';
import Drawing from './components/drawing/Drawing';
import Participants from './components/participants/Participants';
import ChattingBox from './components/chatting/ChattingBox';
import GuideBoard from './components/guideBoard/GuideBoard';
import styles from './SketchRoom.module.scss';
import GameTable from './components/gameTable/GameTable';

const SketchRoom = () => {
  const navigateTo = useNavigateClick();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageListTuple[]>([]);
  const [participantList, setParticipantList] = useState<UserDataType[]>([]);
  const [currentViewGuideBoard, setCurrentVidwGuideBoard] = useState<string>('');
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

  const [remainingTime, setRemainingTime] = useState<number>(drawLimitTime);

  const currentRoomId = userStore(state => state.roomId) ?? '';
  const currentUserId = userStore(state => state.id);
  const currentUserNickName = userStore(state => state.nickName);
  const roomOwnerId = participantList[0]?.id ?? '';
  const isOwner = roomOwnerId === currentUserId;
  const isMyTurn = participantList[currentDrawerIndex]?.id === currentUserId;

  // const currentDrawer = participantList[currentDrawerIndex];

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  const handleSendButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChattingMessage(currentRoomId, { nickName: currentUserNickName, message: message });
    setMessage('');
  };

  const updateMessageList = (newMessageList: MessageListTuple[]) => {
    setMessageList(newMessageList);
  };

  const updateParticipantList = (newParticipantList: UserDataType[]) => {
    setParticipantList(newParticipantList);
  };

  const updateRemainingTime = (second: number) => {
    setRemainingTime(second);
  };

  // 일단 출제자 도중 탈주 상황 처리 (그 다음 차례로 바로 넘어가기)
  // 시간초 내에 출제자를 제외한 참여자가 모두 정답을 맞췄을 경우 다음 순서로 넘어가기
  // 한 문제 끝날떄마다 참여자별로 몇점 얻었는지 guideBoard 하나 추가하기

  // useEffect(() => {
  //   const gameStart = async () => {
  //     // 참가자가 2명 이상이고 게임중이 아니라면
  //   if(participantList.length > 1 && !isPlaying ) {
  //     // 게임 상태 시작으로 변경
  //     await togglePlayingState(currentRoomId);
  //   }

  //   }
  // },[])

  useEffect(() => {
    // 새로고침 시 전역상태로 관리중인 유저정보가 초기화되고 바로 스케치룸에서 로비로 리다이렉트처리
    if (currentUserNickName === '') {
      navigateTo('/');
    }
  }, [currentUserNickName, navigateTo]);

  useRoomData(currentRoomId, currentUserNickName, currentUserId, updateMessageList, updateParticipantList);
  useGameState(currentRoomId, setPlayGameState);

  return (
    <div className={styles.container}>
      {messageList.length && participantList.length && (
        <div className={styles.gameBoard}>
          <div className={styles.logoBox}>
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
              {participantList.map(({ id, nickName }) => (
                <Participants
                  key={id}
                  nickName={nickName}
                  userId={id}
                  currentUserId={currentUserId}
                  roomOwnerId={roomOwnerId}
                />
              ))}
            </div>
            <div className={styles.canvas}>
              <Drawing isMyTurn={isMyTurn} />
              <GuideBoard
                participantList={participantList}
                currentViewGuideBoard={currentViewGuideBoard}
                currentSuggestedWord={currentSuggestedWord}
              />
            </div>
            <ChattingBox
              message={message}
              messageList={messageList}
              onChange={handleMessageChange}
              onSubmit={handleSendButtonClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SketchRoom;
