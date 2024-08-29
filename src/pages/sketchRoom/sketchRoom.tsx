import styles from './sketchRoom.module.scss';
import { useState, useEffect } from 'react';
import Chatting from './chatting/chatting';
import Participants from './participants/participants';
import { sendChattingMessage } from '../../services/sketchRoomService';
import { MessageListTuple } from '../../types/chatting/type';
import { userStore } from '../../store/userStore';
import { UserDataType } from '../../types/user/interface';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import Drawing from './drawing/drawing';

// 이거 nickName이 '' 로 초기화상태일떄 스케치룸 입장시 (루트페이지 안거치고) 루트페이지로 리다이렉트되는 로직 추가해야됨

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

  const handleSendButtonClick = () => {
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
      <div className={styles.logoBox}>로고</div>
      <div className={styles.header}>
        헤드라인 <button onClick={() => setIsMyTurn(!isMyTurn)}>내 턴</button>
      </div>
      <div className={styles.playArea}>
        <div className={styles.participants}>
          현재 참여 인원
          {participantList.map(({ id, nickName }) => (
            <Participants key={id} nickName={nickName} />
          ))}
        </div>
        <div className={styles.canvas}>
          <Drawing isMyTurn={isMyTurn} />
        </div>
        <div className={styles.chattingBox}>
          <div className={styles.chatting}>
            {messageList.map(([id, chatData]) => (
              <Chatting key={id} nickName={chatData.nickName} message={chatData.message} />
            ))}
          </div>
          <div className={styles.chattingInput}>
            <input placeholder="Type your guess here.." value={message} onChange={handleMessageChange} />
            <button onClick={handleSendButtonClick}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchRoom;
