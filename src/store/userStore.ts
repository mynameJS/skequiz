import { create } from 'zustand';
import { UserDataType } from '../types/user/interface';

interface UserActions {
  updateUserNickName: (nickName: UserDataType['nickName']) => void;
}

const userStore = create<UserDataType & UserActions>(set => ({
  nickName: '',
  updateUserNickName: nickName => set(() => ({ nickName: nickName })),
}));

export { userStore };
