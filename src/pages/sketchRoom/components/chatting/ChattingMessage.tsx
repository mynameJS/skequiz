import styles from './ChattingMessage.module.scss';

interface ChattingMessageProps {
  nickName: string;
  message: string;
}

const ChattingMessage = ({ nickName, message }: ChattingMessageProps) => {
  const isSystemMessage = nickName === '시스템메세지';

  return (
    <div>
      {isSystemMessage ? (
        <p className={styles.systemMessage}>{message}</p>
      ) : (
        <p className={styles.userMessage}>
          {nickName} : {message}
        </p>
      )}
    </div>
  );
};

export default ChattingMessage;
