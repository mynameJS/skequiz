import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { userDataType } from '../types/user/interface';

const registerUserData = async (userData: userDataType) => {
  try {
    await addDoc(collection(db, 'users'), userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

export { registerUserData };
