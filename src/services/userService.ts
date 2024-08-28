import { doc, collection, addDoc, getDoc } from 'firebase/firestore';
import { fireStoreDB } from '../config/firebase';
import { UserDataType } from '../types/user/interface';

// 아마 roomId 별로 참여자리스트만 관리할거라 유저데이터를 따로 저장안할거긴한데
// 일단 보류
const registerUserData = async (userData: UserDataType) => {
  try {
    await addDoc(collection(fireStoreDB, 'users'), userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

// 이것도 get 함수 format으로 냅둘 예정
// 일단 보류
const getUserData = async (id: string) => {
  const docRef = doc(fireStoreDB, 'users', id);
  let userData;
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userData = docSnap.data();
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }

  return userData;
};

export { registerUserData, getUserData };
