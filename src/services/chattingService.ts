import { ref, set, onValue, child, push, update, get, getDatabase } from 'firebase/database';
import { realTimeDB } from '../config/firebase';
import { ChattingMessageData } from '../types/chatting/interface';
import { MessageListTuple } from '../types/chatting/type';
import { userDataType } from '../types/user/interface';

const testRoomId = '6';

// 채팅방 생성
const createChattingRoom = async (roomId: string) => {
  try {
    await set(ref(realTimeDB, `room/${roomId}/chatting`), '');
    await set(ref(realTimeDB, `room/${roomId}/participants`), '');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

// createChattingRoom(testRoomId);

// 참여자 추가
const joinParticipant = async (userData: userDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${testRoomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = [...prevParticipantsList, userData];
      const updates: { [key: string]: userDataType[] } = {};
      updates[`/room/${testRoomId}/participants/`] = newParticipantsList;
      await update(ref(realTimeDB), updates);
    } else {
      console.log('No data available');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

// 참여자 떠남
// 이름이 똑같으면 같이 팅기니까 나중에 고유 id로 식별해야될듯
const leaveParticipant = async (targetUserData: userDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${testRoomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = prevParticipantsList.filter(
        (userData: userDataType) => userData.nickName !== targetUserData.nickName
      );
      const updates: { [key: string]: userDataType[] } = {};
      updates[`/room/${testRoomId}/participants/`] = newParticipantsList;
      await update(ref(realTimeDB), updates);
    } else {
      console.log('No data available');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

// 채팅메세지 전송
const sendChattingMessage = async (messageData: ChattingMessageData) => {
  const newChattingKey = push(child(ref(realTimeDB), `room/${testRoomId}/chatting`)).key;
  const updates: { [key: string]: ChattingMessageData } = {};
  updates[`/room/${testRoomId}/chatting/${newChattingKey}`] = messageData;

  try {
    await update(ref(realTimeDB), updates);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding document: ', error.message);
    } else {
      console.error('Unexpected error', error);
    }
  }
};

// 채팅 내역 실시간 업데이트
const getChattingData = (onUpdateData: (messageList: MessageListTuple[]) => void) => {
  const chattingDataRef = ref(realTimeDB, `room/${testRoomId}/chatting`);
  onValue(chattingDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(Object.entries(data));
  });
};

// 채팅 참여자 실시간 업데이트
const getParticipantsData = (onUpdateData: (userData: userDataType[]) => void) => {
  const participantsDataRef = ref(realTimeDB, `room/${testRoomId}/participants`);
  onValue(participantsDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(data);
  });
};

export {
  createChattingRoom,
  joinParticipant,
  leaveParticipant,
  sendChattingMessage,
  getChattingData,
  getParticipantsData,
};
