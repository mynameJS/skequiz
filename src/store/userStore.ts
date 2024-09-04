import { create } from 'zustand';
import { UserDataType } from '../types/user/interface';
import createShortUniqueId from '../utils/createShortUniqueId';

type UserDataWithoutScoreAndAnswer = Omit<UserDataType, 'score' | 'isAnswer' | 'totalScore'>;
interface UserActions {
  updateRoomId: (roomId: UserDataWithoutScoreAndAnswer['roomId']) => void;
  updateUserNickName: (nickName: UserDataWithoutScoreAndAnswer['nickName']) => void;
}

export const userStore = create<UserDataWithoutScoreAndAnswer & UserActions>(set => ({
  roomId: '',
  id: createShortUniqueId(),
  nickName: '',
  updateUserNickName: nickName => set(() => ({ nickName: nickName })),
  updateRoomId: roomId => set(() => ({ roomId: roomId })),
}));
