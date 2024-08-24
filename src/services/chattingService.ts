import { ref, set, onValue, child, push, update } from 'firebase/database';
import { realTimeDB } from '../config/firebase';
import { ChattingMessageData } from '../types/chatting/interface';
import { MessageListTuple } from '../types/chatting/type';

// 이건 채팅방 생성으로 돌리자
// const sendChattingMessage = async messageData => {
//   set(ref(realTimeDB, 'chatRoom/1'), messageData);
// };

const sendChattingMessage = async (messageData: ChattingMessageData) => {
  const newChattingRoomKey = push(child(ref(realTimeDB), 'chatRoom/1')).key;
  const updates: { [key: string]: ChattingMessageData } = {};
  updates['/chatRoom/1/' + newChattingRoomKey] = messageData;

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

const getChattingData = async (onUpdateData: (messageList: MessageListTuple[]) => void) => {
  const chattingDataRef = ref(realTimeDB, 'chatRoom/1');
  onValue(chattingDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(Object.entries(data));
  });
};

export { sendChattingMessage, getChattingData };
