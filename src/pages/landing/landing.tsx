import styles from './landing.module.scss';
import { useState } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';
import { createRandomNickName } from '../../utils/createRandomNickName';
import { registerUserData } from '../../services/userService';
import { UserDataType } from '../../types/user/interface';
import { userStore } from '../../store/userStore';

const Landing = () => {
  const [userData, setUserData] = useState<UserDataType>({ nickName: '' });
  const navigateTo = useNavigateClick();

  const updateCurrentUserNickName = userStore(state => state.updateUserNickName);

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
  // 유저 정보 db 등록, 전역변수 업데이트 후 스케치룸 이동
  const handlePlayButtonClick = async () => {
    await registerUserData(userData);
    updateCurrentUserNickName(userData.nickName);
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
