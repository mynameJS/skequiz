import styles from './sketchRoom.module.scss';

const SketchRoom = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>로고</div>
      <div className={styles.header}>헤드라인</div>
      <div className={styles.playArea}>
        <div className={styles.participants}>참여자영역</div>
        <div className={styles.canvas}>드로잉영역</div>
        <div className={styles.chatting}>채팅영역</div>
      </div>
    </div>
  );
};

export default SketchRoom;
