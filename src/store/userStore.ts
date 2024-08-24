import { create } from 'zustand';
import { userDataType } from '../types/user/interface';

interface UserActions {
  updateUserNickName: (nickName: userDataType['nickName']) => void;
}

const userStore = create<userDataType & UserActions>(set => ({
  nickName: '',
  updateUserNickName: nickName => set(() => ({ nickName: nickName })),
}));

export { userStore };
