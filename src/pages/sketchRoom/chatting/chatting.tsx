import styles from './chatting.module.scss';

interface ChattingProps {
  nickName: string;
  message: string;
}

const Chatting = ({ nickName, message }: ChattingProps) => {
  return (
    <div>
      <p>
        {nickName} : {message}
      </p>
    </div>
  );
};

export default Chatting;
