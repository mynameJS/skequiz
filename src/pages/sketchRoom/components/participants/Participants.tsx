import styles from './Participants.module.scss';

interface ParticipantsProps {
  nickName: string;
  userId: string;
  currentUserId: string;
}

const Participants = ({ nickName, userId, currentUserId }: ParticipantsProps) => {
  const isYou = userId === currentUserId;
  return (
    <div className={styles.nickName}>
      {nickName} {isYou && <span>(You)</span>}
    </div>
  );
};

export default Participants;
