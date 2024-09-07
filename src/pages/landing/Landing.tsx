import { useState } from 'react';
import { createRandomNickName } from '../../utils/createRandomNickName';
import { userStore } from '../../store/userStore';
import SearchingRoom from './components/searchingRoom/SearchingRoom';
import styles from './Landing.module.scss';

const Landing = () => {
  const [userNickName, setUserNickName] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const updateCurrentUserNickName = userStore(state => state.updateUserNickName);

  const handleUserNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickName(e.target.value);
  };

  const handleCreateRanDomNickNameClick = () => {
    setUserNickName(createRandomNickName());
  };

  // 전역변수 업데이트 후 입장 전 서칭룸으로 이동
  const handlePlayButtonClick = () => {
    // 닉네임을 입력하지 않고 플레이버튼 클릭 시 랜덤닉네임 부여
    if (userNickName.trim() === '') {
      const randomNickName = createRandomNickName();
      updateCurrentUserNickName(randomNickName);
    } else {
      updateCurrentUserNickName(userNickName);
    }
    setIsSearching(prevValue => !prevValue);
  };

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
            <button className={styles.createRoomButton}>Create Private Room</button>
          </div>
        </div>
        {isSearching && <SearchingRoom />}
      </div>
    </div>
  );
};

export default Landing;
