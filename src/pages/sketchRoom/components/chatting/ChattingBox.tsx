import { useState, useEffect, useRef } from 'react';
import ChattingMessage from './ChattingMessage';
import ChattingInput from './ChattingInput';
import { sendChattingMessage, getChattingData, updateParticipantAnswer } from '../../../../services/sketchRoomService';
import { MessageListTuple } from '../../../../types/chatting/type';
import { calculateScore } from '../../../../utils/calculateScore';
import { playSound } from '../../../../utils/playSound';
import styles from './ChattingBox.module.scss';

interface ChattingBoxProps {
  currentRoomId: string;
  currentUserNickName: string;
  currentUserId: string;
  currentSuggestedWord: string;
  isMyTurn: boolean;
  drawLimitTime: number;
  remainingTime: number;
  isAnswer: boolean;
  nowDrawing: boolean;
}

const ChattingBox = ({
  currentRoomId,
  currentUserNickName,
  currentUserId,
  currentSuggestedWord,
  isMyTurn,
  drawLimitTime,
  remainingTime,
  isAnswer,
  nowDrawing,
}: ChattingBoxProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageListTuple[]>([]);

  const getScore = calculateScore(drawLimitTime, remainingTime);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  const handleSendButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 제시어가 빈문자열이 아니라 업데이트되었을때 && 정답을 맞추지 않은 상태일때 && nowDrawing 단계일때
    if (currentSuggestedWord && !isAnswer && nowDrawing) {
      const checkAnswer = message.trim() === currentSuggestedWord;

      // nowDrawing 단계일 때만
      // 정답체크하고 시스템메세지보내고, 정답체크 및 스코어업데이트
      if (checkAnswer) {
        await sendChattingMessage(currentRoomId, {
          nickName: 'correctAnswer',
          message: `${currentUserNickName} 님이 정답을 맞추셨습니다`,
        });
        playSound('correctAnswer');
        await updateParticipantAnswer(currentRoomId, currentUserId, getScore);
        setMessage('');
        return;
      }
    }

    await sendChattingMessage(currentRoomId, { nickName: currentUserNickName, message: message });
    setMessage('');
  };

  const updateMessageList = (newMessageList: MessageListTuple[]) => {
    setMessageList(newMessageList);
  };

  useEffect(() => {
    getChattingData(currentRoomId, updateMessageList);
  }, []);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className={styles.chattingBox}>
      <div className={styles.chatting} ref={chatBoxRef}>
        {messageList.map(([id, chatData]) => (
          <ChattingMessage key={id} nickName={chatData.nickName} message={chatData.message} />
        ))}
      </div>
      <ChattingInput
        message={message}
        onChange={handleMessageChange}
        onSubmit={handleSendButtonClick}
        isMyTurn={isMyTurn}
      />
    </div>
  );
};

export default ChattingBox;
