import { ref, onValue, child, push, update, get, getDatabase } from 'firebase/database';
import { realTimeDB } from '../config/firebase';
import { ChattingMessageData } from '../types/chatting/interface';
import { MessageListTuple } from '../types/chatting/type';
import { UserDataType } from '../types/user/interface';
import { RoomData } from '../types/gameState/interface';
import { DrawStartTime, PlayGameState } from '../types/gameState/interface';
import { Timestamp } from 'firebase/firestore';

// 스케치룸 생성
// 나중에 커스텀룸 만들떄 gameOption 만들어서 현재 고정값 되어있는거 유동적으로 바꿔야됨
const createChattingRoom = async (roomId: string) => {
  try {
    const updates = {
      [`room/${roomId}/chatting`]: '',
      [`room/${roomId}/participants`]: '',
      [`room/${roomId}/playerLimit`]: 6,
      [`room/${roomId}/currentDrawerIndex`]: 0,
      [`room/${roomId}/wholeRound`]: 3,
      [`room/${roomId}/currentRound`]: 1,
      [`room/${roomId}/currentSuggestedWord`]: '',
      [`room/${roomId}/drawStartTime`]: { seconds: 0, nanoseconds: 0 },
      [`room/${roomId}/drawLimitTime`]: 90,
      [`room/${roomId}/isPlaying`]: false,
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
const leaveParticipant = async (roomId: string, targetUserId: string) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = prevParticipantsList.filter((userData: UserDataType) => userData.id !== targetUserId);
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

// 채팅 내역 실시간 구독
const getChattingData = (roomId: string, onUpdateData: (messageList: MessageListTuple[]) => void) => {
  const chattingDataRef = ref(realTimeDB, `room/${roomId}/chatting`);
  onValue(chattingDataRef, snapshot => {
    const data = snapshot.val();
    onUpdateData(Object.entries(data));
  });
};

// 채팅 참여자 실시간 구독
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
    const dataConvertedArr = Object.entries(data) as [string, RoomData][];
    const openRoom = dataConvertedArr
      .filter(roomData => {
        if (roomData[1].participants && roomData[1].participants.length < roomData[1].playerLimit) return true;
      })
      .map(roomData => roomData[0]);
    if (openRoom.length === 0) {
      onUpdateData('create');
    } else {
      onUpdateData(openRoom);
    }
  });
};

// 제시어 변경
const updateSuggestedWord = async (roomId: string, selectedSuggestedWord: string) => {
  const dbRef = ref(getDatabase());
  try {
    const prevSuggestedWordRef = await get(child(dbRef, `room/${roomId}/currentSuggestedWord`));
    if (prevSuggestedWordRef.exists()) {
      const newSuggestedWord = selectedSuggestedWord;
      const updates: { [key: string]: string } = {};
      updates[`/room/${roomId}/currentSuggestedWord/`] = newSuggestedWord;
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

// 현재 출제자 및 라운드 업데이트
const updatePlayOrder = async (roomId: string) => {
  const dbRef = ref(getDatabase());
  try {
    const currentParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    const currentDrawerIndexRef = await get(child(dbRef, `room/${roomId}/currentDrawerIndex`));
    const currentRoundRef = await get(child(dbRef, `room/${roomId}/currentRound`));
    const wholeRoundRef = await get(child(dbRef, `room/${roomId}/wholeRound`));

    const refCheck =
      currentParticipantsRef.exists() &&
      currentDrawerIndexRef.exists() &&
      currentRoundRef.exists() &&
      wholeRoundRef.exists();

    const updates: { [key: string]: string | number | boolean } = {};

    if (refCheck) {
      const currentParticipants = currentParticipantsRef.val();
      const currentDrawerIndex = currentDrawerIndexRef.val();
      const currentRound = currentRoundRef.val();
      const wholeRound = wholeRoundRef.val();
      let result = false;

      // 현재 라운드의 마지막 플레이어라면 다음 라운드로 넘어감
      if (currentDrawerIndex === currentParticipants.length - 1) {
        // 잔여 라운드가 남아 있다면
        if (currentRound < wholeRound) {
          updates[`/room/${roomId}/currentRound`] = currentRound + 1; // 다음 라운드로 넘어감
          updates[`/room/${roomId}/currentDrawerIndex`] = 0; // 플레이 순서 초기화
          console.log('다음 라운드로 넘어가는데 플레이 순서 초기화하니?');
          // 참가자 스코어 및 정답체크 및 제시어 초기화
          await initParticipantsScore(roomId);
          await updateSuggestedWord(roomId, '');
          // 잔여 라운드가 없다면 라운드 및 플레이순서 초기화
        } else {
          updates[`/room/${roomId}/currentRound`] = 1; // 라운드 초기화
          updates[`/room/${roomId}/currentDrawerIndex`] = 0; // 플레이 순서 초기화
          console.log('플레이어 순서 초기화, 모든게임끝');
          // 참가자 스코어 및 정답체크 및 제시어 초기화
          await initParticipantsScore(roomId);
          await updateSuggestedWord(roomId, '');
          // 잔여 라운드가 없다면 true 반환
          result = true;
        }
      } else {
        updates[`/room/${roomId}/currentDrawerIndex`] = currentDrawerIndex + 1; // 다음 플레이어로 넘어감
        // console.log(currentDrawerIndex, currentDrawerIndex + 1);
        // 참가자 스코어 및 정답체크 및 제시어 초기화
        await updateSuggestedWord(roomId, '');
        await initParticipantsScore(roomId);
      }

      await update(ref(realTimeDB), updates);
      return result;
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

// 드로잉 시작 시간 업데이트
// 시작 시간을 기준으로 플레이 중인 room 의 서버 시간을 클라이언트 끼리 동기화하기 위해
const updateDrawStartTime = async (roomId: string, isInit?: boolean) => {
  const dbRef = ref(getDatabase());
  try {
    const drawStartTimeRef = await get(child(dbRef, `room/${roomId}/drawStartTime`));
    if (drawStartTimeRef.exists()) {
      const initTime = { seconds: 0, nanoseconds: 0 };
      const startTime = Timestamp.now();
      const updates: { [key: string]: Timestamp | DrawStartTime } = {};
      updates[`/room/${roomId}/drawStartTime/`] = isInit ? initTime : startTime;
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

// 참가자 정답체크 및 스코어 업데이트
const updateParticipantAnswer = async (roomId: string, userId: string, addScore: number) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();
      const newParticipantsList = prevParticipantsList.map((participant: UserDataType) => {
        if (participant.id === userId) {
          return { ...participant, isAnswer: true, score: addScore, totalScore: participant.totalScore + addScore };
        }
        return participant;
      });
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

// 전체 참가자 정답체크 및 스코어 초기화
const initParticipantsScore = async (roomId: string, resetTotal: boolean = false) => {
  const dbRef = ref(getDatabase());
  try {
    const prevParticipantsRef = await get(child(dbRef, `room/${roomId}/participants`));
    if (prevParticipantsRef.exists()) {
      const prevParticipantsList = prevParticipantsRef.val();

      // resetTotal 매개변수에 따라 초기화 방식 분기
      const newParticipantsList = prevParticipantsList.map((participant: UserDataType) =>
        resetTotal
          ? {
              ...participant,
              score: 0,
              totalScore: 0,
              isAnswer: false,
            }
          : {
              ...participant,
              score: 0,
              isAnswer: false,
            }
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

// 게임 진행 상황 업데이트(토글)
const togglePlayingState = async (roomId: string) => {
  const dbRef = ref(getDatabase());
  try {
    const prevIsPlayingRef = await get(child(dbRef, `room/${roomId}/isPlaying`));
    if (prevIsPlayingRef.exists()) {
      const prevIsPlayingState = prevIsPlayingRef.val();
      const newIsPlayingState = !prevIsPlayingState;
      const updates: { [key: string]: boolean } = {};
      updates[`/room/${roomId}/isPlaying/`] = newIsPlayingState;
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

// 게임 정보 실시간 구독
const getPlayGameState = (roomId: string, onUpdateState: (gameState: PlayGameState) => void) => {
  const playGameStateDataRef = ref(realTimeDB, `room/${roomId}`);
  onValue(playGameStateDataRef, snapshot => {
    const {
      playerLimit,
      currentDrawerIndex,
      wholeRound,
      currentRound,
      currentSuggestedWord,
      drawStartTime,
      drawLimitTime,
      isPlaying,
    } = snapshot.val();
    const newPlayGameState = {
      playerLimit,
      currentDrawerIndex,
      wholeRound,
      currentRound,
      currentSuggestedWord,
      drawStartTime,
      drawLimitTime,
      isPlaying,
    };
    onUpdateState(newPlayGameState);
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
  updateSuggestedWord,
  updatePlayOrder,
  updateDrawStartTime,
  getPlayGameState,
  updateParticipantAnswer,
  initParticipantsScore,
  togglePlayingState,
};
