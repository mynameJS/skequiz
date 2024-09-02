import crown from '../../../../assets/crown.png';
import styles from './Participants.module.scss';

interface ParticipantsProps {
  nickName: string;
  userId: string;
  currentUserId: string;
  roomOwnerId: string;
}

const Participants = ({ nickName, userId, currentUserId, roomOwnerId }: ParticipantsProps) => {
  const isYou = userId === currentUserId;
  const checkOwner = roomOwnerId === userId;
  return (
    <div className={styles.nickName}>
      {checkOwner && <img className={styles.owner} src={crown} alt="방장" />}
      {nickName} {isYou && <span>(You)</span>}
    </div>
  );
};

export default Participants;
