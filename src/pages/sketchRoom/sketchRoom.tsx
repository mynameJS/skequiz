import styles from './sketchRoom.module.scss';
import { useEffect, useState } from 'react';
import Chatting from './chatting/chatting';
import { sendChattingMessage, getChattingData } from '../../services/chattingService';
import { MessageListTuple } from '../../types/chatting/type';
import { userStore } from '../../store/userStore';

const SketchRoom = () => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageListTuple[]>([]);

  const currentUserNickName = userStore(state => state.nickName);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleSendButtonClick = () => {
    sendChattingMessage({ nickName: currentUserNickName, message: message });
    setMessage('');
  };

  const updateMessageList = (newMessageList: MessageListTuple[]) => {
    setMessageList(newMessageList);
  };

  useEffect(() => {
    const fetchChattingData = async () => {
      await getChattingData(updateMessageList);
    };

    fetchChattingData();
  }, []);

  // 세션 사용 일단 보류

  // useEffect(() => {
  //   const fetchCurrentUserData = async () => {
  //     const currentUserKey = sessionStorage.getItem('currentUserKey');
  //     if (currentUserKey) {
  //       const currentUserData = await getUserData(currentUserKey);
  //       setCurrentUserData(currentUserData);
  //     }
  //   };

  //   fetchCurrentUserData();
  // }, []);

  if (!messageList.length) return null;

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>로고</div>
      <div className={styles.header}>헤드라인</div>
      <div className={styles.playArea}>
        <div className={styles.participants}>참여자영역</div>
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
