import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useNavigateClick from '../../hooks/useNavigateClick';
import { userStore } from '../../store/userStore';
import { createRandomNickName } from '../../utils/createRandomNickName';
import styles from './EnterPrivateSketchRoom.module.scss';

const EnterPrivateSketchRoom = () => {
  const navigateTo = useNavigateClick();
  const { roomId } = useParams();
  const [userNickName, setUserNickName] = useState<string>('');

  const updateCurrentUserNickName = userStore(state => state.updateUserNickName);
  const updateCurrentRoomId = userStore(state => state.updateRoomId);

  const handleUserNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickName(e.target.value);
  };

  const handleCreateRanDomNickNameClick = () => {
    setUserNickName(createRandomNickName());
  };

  const handlePlayButtonClick = () => {
    if (userNickName.trim() === '') {
      const randomNickName = createRandomNickName();
      updateCurrentUserNickName(randomNickName);
    } else {
      updateCurrentUserNickName(userNickName);
    }
    navigateTo('/sketchRoom');
  };

  useEffect(() => {
    updateCurrentRoomId(roomId);
  }, [roomId]);

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <div className={styles.logoBox}>SKEQUIZ</div>
        <div className={styles.actionBox}>
          <div className={styles.inputName}>
            <input placeholder="Type your nickname" value={userNickName} onChange={handleUserNickNameChange} />
            <button onClick={handleCreateRanDomNickNameClick}>🎲</button>
          </div>
          <div className={styles.gameButton}>
            <button className={styles.playButton} onClick={handlePlayButtonClick}>
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterPrivateSketchRoom;
