import { useEffect, useRef } from 'react';
import ChattingMessage from './ChattingMessage';
import ChattingInput from './ChattingInput';
import { MessageListTuple } from '../../../../types/chatting/type';
import styles from './ChattingBox.module.scss';

interface ChattingBoxProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  messageList: MessageListTuple[];
}

const ChattingBox = ({ message, messageList, onChange, onSubmit }: ChattingBoxProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

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
      <ChattingInput message={message} onChange={onChange} onSubmit={onSubmit} />
    </div>
  );
};

export default ChattingBox;
