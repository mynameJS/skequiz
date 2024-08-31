import { useState, useEffect } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import { userStore } from '../../store/userStore';
import { sendChattingMessage } from '../../services/sketchRoomService';
import { MessageListTuple } from '../../types/chatting/type';
import { UserDataType } from '../../types/user/interface';
import Drawing from './components/drawing/Drawing';
import Participants from './components/participants/Participants';
import ChattingBox from './components/chatting/ChattingBox';
import GameTable from './components/gameTable/GameTable';
import styles from './SketchRoom.module.scss';

const SketchRoom = () => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageListTuple[]>([]);
  const [participantList, setParticipantList] = useState<UserDataType[]>([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const navigateTo = useNavigateClick();

  const currentRoomId = userStore(state => state.roomId) ?? '';
  const currentUserId = userStore(state => state.id);
  const currentUserNickName = userStore(state => state.nickName);

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

  useEffect(() => {
    // 새로고침 시 전역상태로 관리중인 유저정보가 초기화되고 바로 스케치룸에서 로비로 리다이렉트처리
    if (currentUserNickName === '') {
      navigateTo('/');
    }
  }, [currentUserNickName, navigateTo]);

  useRoomData(currentRoomId, currentUserNickName, currentUserId, updateMessageList, updateParticipantList);

  if (!messageList.length || !participantList.length) return null;

  return (
    <div className={styles.container}>
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
            <span>🎨</span>
          </p>
        </div>
        <div className={styles.header}>
          <button onClick={() => setIsMyTurn(!isMyTurn)}>{isMyTurn ? '드로잉' : '왓칭'}</button>
        </div>
        <div className={styles.playArea}>
          <div className={styles.participants}>
            <p>현재 참여 인원</p>
            {participantList.map(({ id, nickName }) => (
              <Participants key={id} nickName={nickName} />
            ))}
          </div>
          <div className={styles.canvas}>
            <Drawing isMyTurn={isMyTurn} />
          </div>
          <ChattingBox
            message={message}
            messageList={messageList}
            onChange={handleMessageChange}
            onSubmit={handleSendButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SketchRoom;
