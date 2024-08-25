import styles from './chatting.module.scss';

interface ChattingProps {
  nickName: string;
  message: string;
}

const Chatting = ({ nickName, message }: ChattingProps) => {
  const isSystemMessage = nickName === '시스템메세지';

  return (
    <div>
      {isSystemMessage ? (
        <p className={styles.systemMessage}>{message}</p>
      ) : (
        <p>
          {nickName} : {message}
        </p>
      )}
    </div>
  );
};

export default Chatting;
