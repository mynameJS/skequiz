import { create } from 'zustand';
import { UserDataType } from '../types/user/interface';

interface UserActions {
  updateUserId: (id: UserDataType['id']) => void;
  updateUserNickName: (nickName: UserDataType['nickName']) => void;
}

const userStore = create<UserDataType & UserActions>(set => ({
  id: '',
  nickName: '',
  updateUserNickName: nickName => set(() => ({ nickName: nickName })),
  updateUserId: id => set(() => ({ id: id })),
}));

export { userStore };
