import { useState, useEffect } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import useRoomData from './hook/useRoomData';
import { userStore } from '../../store/userStore';
import { sendChattingMessage } from '../../services/sketchRoomService';
import { MessageListTuple } from '../../types/chatting/type';
import { UserDataType } from '../../types/user/interface';
import Drawing from './components/drawing/drawing';
import Participants from './components/participants/participants';
import ChattingBox from './components/chatting/ChattingBox';
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
        <ChattingBox
          message={message}
          messageList={messageList}
          onChange={handleMessageChange}
          onSubmit={handleSendButtonClick}
        />
      </div>
    </div>
  );
};

export default SketchRoom;
