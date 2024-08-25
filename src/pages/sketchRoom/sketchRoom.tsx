import styles from './sketchRoom.module.scss';
import { useEffect, useState } from 'react';
import Chatting from './chatting/chatting';
import Participants from './participants/participants';
import {
  sendChattingMessage,
  getChattingData,
  getParticipantsData,
  joinParticipant,
  leaveParticipant,
} from '../../services/chattingService';
import { MessageListTuple } from '../../types/chatting/type';
import { userStore } from '../../store/userStore';
import { userDataType } from '../../types/user/interface';

// 이거 nickName이 '' 로 초기화상태일떄 스케치룸 입장시 (루트페이지 안거치고) 루트페이지로 리다이렉트되는 로직 추가해야됨

const SketchRoom = () => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageListTuple[]>([]);
  const [participantList, setParticipantList] = useState<userDataType[]>([]);
  const currentUserNickName = userStore(state => state.nickName);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleSendButtonClick = () => {
    sendChattingMessage({ nickName: currentUserNickName, message: message });
    setMessage('');
  };

  const updateMessageList = (newMessageList: MessageListTuple[]) => {
    setMessageList(newMessageList);
  };

  const updateParticipantList = (newParticipantList: userDataType[]) => {
    setParticipantList(newParticipantList);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      await sendChattingMessage({ nickName: '시스템메세지', message: `${currentUserNickName} 님이 입장하였습니다.` });
      await joinParticipant({ nickName: currentUserNickName });
      getChattingData(updateMessageList);
      getParticipantsData(updateParticipantList);
    };

    fetchRoomData();
    return () => {
      const sendLeaveMessage = async () => {
        await sendChattingMessage({ nickName: '시스템메세지', message: `${currentUserNickName} 님이 퇴장하였습니다.` });
        await leaveParticipant({ nickName: currentUserNickName });
      };
      sendLeaveMessage();
    };
    // 의존성 일단 빼놓자
  }, []);

  if (!messageList.length || !participantList.length) return null;

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>로고</div>
      <div className={styles.header}>헤드라인</div>
      <div className={styles.playArea}>
        <div className={styles.participants}>
          {/* 일단 임시로 key는 인덱스 */}
          현재 참여 인원
          {participantList.map(({ nickName }, index) => (
            <Participants key={index} nickName={nickName} />
          ))}
        </div>
        <div className={styles.canvas}>드로잉영역</div>
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
