import styles from './ChattingInput.module.scss';

interface ChattingInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChattingInput = ({ message, onSubmit, onChange }: ChattingInputProps) => {
  return (
    <div className={styles.chattingInput}>
      <form onSubmit={onSubmit}>
        <input placeholder="Type your guess here.." value={message} onChange={onChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChattingInput;
