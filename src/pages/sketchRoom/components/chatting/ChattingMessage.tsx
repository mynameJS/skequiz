import styles from './ChattingMessage.module.scss';

interface ChattingMessageProps {
  nickName: string;
  message: string;
}

const ChattingMessage = ({ nickName, message }: ChattingMessageProps) => {
  const systemMessageClasses: { [key: string]: string } = {
    enterUser: styles.enterUser,
    leaveUser: styles.leaveUser,
    correctAnswer: styles.correctAnswer,
  };

  if (nickName in systemMessageClasses) {
    return <p className={`${styles.systemMessage} ${systemMessageClasses[nickName]}`}>{message}</p>;
  }

  return (
    <p className={styles.userMessage}>
      {nickName} : {message}
    </p>
  );
};

export default ChattingMessage;
