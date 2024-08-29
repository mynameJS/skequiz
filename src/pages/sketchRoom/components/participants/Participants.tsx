import styles from './Participants.module.scss';

interface ParticipantsProps {
  nickName: string;
}

const Participants = ({ nickName }: ParticipantsProps) => {
  return <div className={styles.nickName}>{nickName}</div>;
};

export default Participants;
