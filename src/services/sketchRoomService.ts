import { ref, onValue, child, push, update, get, getDatabase } from 'firebase/database';
import { realTimeDB } from '../config/firebase';
import { ChattingMessageData } from '../types/chatting/interface';
import { MessageListTuple } from '../types/chatting/type';
import { UserDataType } from '../types/user/interface';

// 스케치룸 생성
// 일단 테스트용으로 참여자 제한 2명으로 설정
const createChattingRoom = async (roomId: string) => {
  try {
    const updates = {
      [`room/${roomId}/chatting`]: '',
      [`room/${roomId}/participants`]: '',
      [`room/${roomId}/limit`]: 3,
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

// 참여자 추가
const joinParticipant = async (roomId: string, userData: UserDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = [...prevParticipantsList, userData];
      const updates: { [key: string]: UserDataType[] } = {};
      updates[`/room/${roomId}/participants/`] = newParticipantsList;
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
const leaveParticipant = async (roomId: string, targetUserData: UserDataType) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = prevParticipantsList.filter(
        (userData: UserDataType) => userData.id !== targetUserData.id
      );
      const updates: { [key: string]: UserDataType[] } = {};
      updates[`/room/${roomId}/participants/`] = newParticipantsList;
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
const sendChattingMessage = async (roomId: string, messageData: ChattingMessageData) => {
  const newChattingKey = push(child(ref(realTimeDB), `room/${roomId}/chatting`)).key;
  const updates: { [key: string]: ChattingMessageData } = {};
  updates[`/room/${roomId}/chatting/${newChattingKey}`] = messageData;

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
const getChattingData = (roomId: string, onUpdateData: (messageList: MessageListTuple[]) => void) => {
  const chattingDataRef = ref(realTimeDB, `room/${roomId}/chatting`);
  onValue(chattingDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(Object.entries(data));
  });
};

// 채팅 참여자 실시간 업데이트
const getParticipantsData = (roomId: string, onUpdateData: (userData: UserDataType[]) => void) => {
  const participantsDataRef = ref(realTimeDB, `room/${roomId}/participants`);
  onValue(participantsDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(data);
  });
};

// 현재 플레이중인 Room 중에 입장가능한 Room id
const getExistingRoomData = (onUpdateData: (roomIdList: string[] | string) => void) => {
  const currentExistingRoomDataRef = ref(realTimeDB, `room`);
  onValue(currentExistingRoomDataRef, snapshot => {
    const data = snapshot.val();
    const dataConvertedArr = Object.entries(data);
    const openRoom = dataConvertedArr
      .filter(roomData => {
        if (roomData[1].participants && roomData[1].participants.length < roomData[1].limit) return true;
      })
      .map(roomData => roomData[0]);
    if (openRoom.length === 0) {
      onUpdateData('create');
    } else {
      onUpdateData(openRoom);
    }
  });
};

export {
  createChattingRoom,
  joinParticipant,
  leaveParticipant,
  sendChattingMessage,
  getChattingData,
  getParticipantsData,
  getExistingRoomData,
};
