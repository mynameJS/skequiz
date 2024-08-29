import { ref, onValue, child, push, update, get, getDatabase } from 'firebase/database';
import { realTimeDB } from '../config/firebase';
import { ChattingMessageData } from '../types/chatting/interface';
import { MessageListTuple } from '../types/chatting/type';
import { UserDataType } from '../types/user/interface';

const testRoomId = '1';

// 스케치룸 생성
const createChattingRoom = async (roomId: string) => {
  try {
    const updates = {
      [`room/${roomId}/chatting`]: '',
      [`room/${roomId}/participants`]: '',
    };
    await update(ref(realTimeDB), updates);
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
const joinParticipant = async (userData: UserDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${testRoomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = [...prevParticipantsList, userData];
      const updates: { [key: string]: UserDataType[] } = {};
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
const leaveParticipant = async (targetUserData: UserDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${testRoomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = prevParticipantsList.filter(
        (userData: UserDataType) => userData.id !== targetUserData.id
      );
      const updates: { [key: string]: UserDataType[] } = {};
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
const getParticipantsData = (onUpdateData: (userData: UserDataType[]) => void) => {
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
