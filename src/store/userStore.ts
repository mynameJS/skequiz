import { create } from 'zustand';
import { UserDataType } from '../types/user/interface';
import createShortUniqueId from '../utils/createShortUniqueId';

interface UserActions {
  updateRoomId: (roomId: UserDataType['roomId']) => void;
  updateUserNickName: (nickName: UserDataType['nickName']) => void;
}

const userStore = create<UserDataType & UserActions>(set => ({
  roomId: '',
  id: createShortUniqueId(),
  nickName: '',
  updateUserNickName: nickName => set(() => ({ nickName: nickName })),
  updateRoomId: roomId => set(() => ({ roomId: roomId })),
}));

export { userStore };
