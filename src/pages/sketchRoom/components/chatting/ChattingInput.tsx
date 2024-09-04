import styles from './ChattingInput.module.scss';

interface ChattingInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isMyTurn: boolean;
}

const ChattingInput = ({ message, onSubmit, onChange, isMyTurn }: ChattingInputProps) => {
  return (
    <div className={styles.chattingInput}>
      <form onSubmit={onSubmit}>
        <input placeholder="Type your guess here.." value={message} onChange={onChange} disabled={isMyTurn} />
      </form>
    </div>
  );
};

export default ChattingInput;
