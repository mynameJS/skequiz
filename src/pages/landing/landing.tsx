import styles from './landing.module.scss';
import { useState } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import { createRandomNickName } from '../../utils/createRandomNickName';
import { registerUserData } from '../../services/userService';
import { userDataType } from '../../types/user/interface';

const Landing = () => {
  const [userData, setUserData] = useState<userDataType>({ nickName: '' });
  const navigateTo = useNavigateClick();

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserData = {
      ...userData,
      nickName: e.target.value,
    };
    setUserData(newUserData);
  };
  const handleCreateRanDomNickNameClick = () => {
    const newUserData = {
      ...userData,
      nickName: createRandomNickName(),
    };
    setUserData(newUserData);
  };
  // 유저 등록 후 스케치룸 이동
  const handlePlayButtonClick = () => {
    registerUserData(userData);
    navigateTo('/sketchRoom');
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <div className={styles.logoBox}>Logo</div>
        <div className={styles.inputBox}>
          <input placeholder="Enter Your NickName" value={userData.nickName} onChange={handleUserNameChange} />
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
