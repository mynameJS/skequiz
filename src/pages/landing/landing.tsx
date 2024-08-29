import styles from './landing.module.scss';
import { useState } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import { createRandomNickName } from '../../utils/createRandomNickName';
import { userStore } from '../../store/userStore';

const Landing = () => {
  const [userNickName, setUserNickName] = useState<string>('');
  const navigateTo = useNavigateClick();

  const updateCurrentUserNickName = userStore(state => state.updateUserNickName);

  const handleUserNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickName(e.target.value);
  };

  const handleCreateRanDomNickNameClick = () => {
    setUserNickName(createRandomNickName());
  };
  // 전역변수 업데이트 후 입장 전 서칭룸으로 이동
  const handlePlayButtonClick = async () => {
    updateCurrentUserNickName(userNickName);
    navigateTo('/searchingRoom');
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <div className={styles.logoBox}>Logo</div>
        <div className={styles.inputBox}>
          <input placeholder="Enter Your NickName" value={userNickName} onChange={handleUserNickNameChange} />
          <button onClick={handleCreateRanDomNickNameClick}>🎲</button>
        </div>
        <button className={styles.playButton} onClick={handlePlayButtonClick}>
          Play
        </button>
        <button className={styles.CreateRoomButton}>Create Custom Room</button>
      </div>
    </div>
  );
};

export default Landing;
