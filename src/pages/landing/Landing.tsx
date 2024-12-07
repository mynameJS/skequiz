import { useState } from 'react';
import { userStore } from '../../store/userStore';
import createShortUniqueId from '../../utils/createShortUniqueId';
import SearchingRoom from './components/searchingRoom/SearchingRoom';
// import PatchNote from './components/patchNote/PatchNote';
import useNavigateClick from '../../hooks/useNavigateClick';
import { createRandomNickName } from '../../utils/createRandomNickName';
import { createChattingRoom } from '../../services/sketchRoomService';
import styles from './Landing.module.scss';

const Landing = () => {
  const [userNickName, setUserNickName] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const navigateTo = useNavigateClick();

  const updateCurrentUserNickName = userStore(state => state.updateUserNickName);

  const updateCurrentRoomId = userStore(state => state.updateRoomId);

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

  // 사설방 개설 시 isPublic false 로 변환 후 바로 입장
  const handleCreatePrivateRoomButtonClick = async () => {
    // 닉네임을 입력하지 않고 플레이버튼 클릭 시 랜덤닉네임 부여
    if (userNickName.trim() === '') {
      const randomNickName = createRandomNickName();
      updateCurrentUserNickName(randomNickName);
    } else {
      updateCurrentUserNickName(userNickName);
    }
    const newRoomId = createShortUniqueId();
    updateCurrentRoomId(newRoomId);
    // 사설방 개설
    await createChattingRoom(newRoomId, false);
    // 사설방 입장
    setTimeout(() => {
      navigateTo('/sketchRoom');
    }, 1000);
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
            <button className={styles.createRoomButton} onClick={handleCreatePrivateRoomButtonClick}>
              Create Private Room
            </button>
          </div>
        </div>
        {isSearching && <SearchingRoom />}
      </div>
      {/* <PatchNote /> */}
    </div>
  );
};

export default Landing;
