import crown from '../../../../assets/image/crown.png';
import styles from './Participants.module.scss';

interface ParticipantsProps {
  nickName: string;
  userId: string;
  currentUserId: string;
  roomOwnerId: string;
  currentDrawerId: string;
  isPlaying: boolean;
  isAnswer: boolean;
  totalScore: number;
}

const Participants = ({
  nickName,
  userId,
  currentUserId,
  roomOwnerId,
  currentDrawerId,
  isPlaying,
  isAnswer,
  totalScore,
}: ParticipantsProps) => {
  const isYou = userId === currentUserId;
  const checkOwner = roomOwnerId === userId;
  const isCurrentDrawer = currentDrawerId === userId;

  const containerClassName = `${styles.container} ${
    isPlaying ? (isCurrentDrawer ? styles.drawerNickName : isAnswer ? styles.answerNickName : '') : ''
  }`;

  return (
    <div className={containerClassName}>
      <div className={styles.nickNameBox}>
        {checkOwner && <img className={styles.owner} src={crown} alt="방장" />}
        <p>
          {nickName} {isYou && <span>(You)</span>}
        </p>
      </div>
      <p>{totalScore} point .</p>
    </div>
  );
};

export default Participants;
