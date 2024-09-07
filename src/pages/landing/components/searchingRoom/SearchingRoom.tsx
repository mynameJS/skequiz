import { useEffect, useState } from 'react';
import { createChattingRoom, getExistingRoomData } from '../../../../services/sketchRoomService';
import { userStore } from '../../../../store/userStore';
import createShortUniqueId from '../../../../utils/createShortUniqueId';
import useNavigateClick from '../../../../hooks/useNavigateClick';
import spiralSpinner from '../../../../assets/image/spiral_spinner.gif.gif';
import styles from './SearchingRoom.module.scss';

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
        setTimeout(() => {
          navigateTo('/sketchRoom');
        }, 2000);
        return;
      }

      if (openRoomList.length) {
        const targetRoomId = openRoomList[0];
        updateCurrentRoomId(targetRoomId);
        setTimeout(() => {
          navigateTo('/sketchRoom');
        }, 2000);
        return;
      }
    };
    selectingRoom();
  }, [openRoomList, navigateTo, updateCurrentRoomId]);
  return (
    <div className={styles.container}>
      <img className={styles.spinner} src={spiralSpinner} alt="로딩바" />
      <p>Searching for an opponent...</p>
    </div>
  );
};

export default SearchingRoom;
