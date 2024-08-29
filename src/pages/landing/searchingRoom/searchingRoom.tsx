import { useEffect, useState } from 'react';
import { createChattingRoom, getExistingRoomData } from '../../../services/sketchRoomService';
import { userStore } from '../../../store/userStore';
import createShortUniqueId from '../../../utils/createShortUniqueId';
import useNavigateClick from '../../../hooks/useNavigateClick';
import styles from './searchingRoom.module.scss';

const SearchingRoom = () => {
  const [openRoomList, setOpenRoomList] = useState<string[] | string>([]);
  const navigateTo = useNavigateClick();

  const updateCurrentRoomId = userStore(state => state.updateRoomId);

  const updateOpenRoomList = (currentOpenRoomList: string[] | string) => {
    setOpenRoomList(currentOpenRoomList);
  };

  useEffect(() => {
    getExistingRoomData(updateOpenRoomList);
  }, []);

  useEffect(() => {
    const selectingRoom = async () => {
      if (openRoomList === 'create') {
        const newRoomId = createShortUniqueId();
        updateCurrentRoomId(newRoomId);
        await createChattingRoom(newRoomId);
        navigateTo('/sketchRoom');
        return;
      }

      if (openRoomList.length) {
        const targetRoomId = openRoomList[0];
        updateCurrentRoomId(targetRoomId);
        navigateTo('/sketchRoom');
        return;
      }
    };
    selectingRoom();
  }, [openRoomList, navigateTo, updateCurrentRoomId]);
  return <div className={styles.container}>플레이어 찾는 중...</div>;
};

export default SearchingRoom;
