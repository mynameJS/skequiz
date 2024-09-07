import { useEffect } from 'react';
import {
  sendChattingMessage,
  getParticipantsData,
  joinParticipant,
  leaveParticipant,
  deletePlayRoom,
} from '../../../services/sketchRoomService';
import { UserDataType } from '../../../types/user/interface';
import { playSound } from '../../../utils/playSound';

const useRoomData = (
  currentRoomId: string,
  currentUserNickName: string,
  currentUserId: string,
  updateParticipantList: (participants: UserDataType[]) => void,
  currentParticipantListLength: number
) => {
  useEffect(() => {
    const fetchRoomData = async () => {
      await sendChattingMessage(currentRoomId, {
        nickName: 'enterUser',
        message: `${currentUserNickName} 님이 입장하였습니다.`,
      });

      playSound('enterRoom');

      await joinParticipant(currentRoomId, {
        id: currentUserId,
        nickName: currentUserNickName,
        score: 0,
        totalScore: 0,
        isAnswer: false,
      });
      getParticipantsData(currentRoomId, updateParticipantList);
    };

    fetchRoomData();

    // 브라우저 강제 종료 시 클린업 함수 작동 안할 것을 대비한 beforeunload 이벤트핸들러
    // 기존의 await 키워드 2개로 실행했을 시 beforeUnload 이벤트 발생 시 모든 비동기 처리가 실행되지 않았음
    // 먼저 실행된 sendChattingMessage 함수만 실행되는 이슈 발생
    // 검색해보니 beforeunload 이벤트에 비동기처리 시 모든 비동기처리가 실행된다는 보장이 없다고함 (다 실행되기 전에 페이지 닫히면)
    // 첫번쨰 비동기처리는 실행되는 걸 단서삼아 Promise.all 로 하나의 await 키워드 안에서 모두 실행시켜서 일단은 정상작동되게 만듦
    const handleUnload = async (currentParticipantListLength: number) => {
      console.log(currentParticipantListLength);
      try {
        await Promise.all([
          sendChattingMessage(currentRoomId, {
            nickName: 'leaveUser',
            message: `${currentUserNickName} 님이 퇴장하였습니다.`,
          }),
          leaveParticipant(currentRoomId, currentUserId),
          // 인원이 1명일 때 방을 나가게되면 게임룸 삭제
          currentParticipantListLength === 0 ? deletePlayRoom(currentRoomId) : Promise.resolve(),
        ]);
      } catch (error) {
        console.error('Error during unload:', error);
      }
    };
    // 브라우저 종료 또는 새로고침 감지
    window.addEventListener('beforeunload', () => handleUnload(currentParticipantListLength));

    return () => {
      const sendLeaveMessage = async () => {
        console.log('ddd', currentParticipantListLength);
        if (currentParticipantListLength === 0) {
          await deletePlayRoom(currentRoomId);
          return;
        }
        await sendChattingMessage(currentRoomId, {
          nickName: 'leaveUser',
          message: `${currentUserNickName} 님이 퇴장하였습니다.`,
        });
        await leaveParticipant(currentRoomId, currentUserId);
      };
      sendLeaveMessage();
      playSound('leaveRoom');
      // 이벤트 핸들러 구독 취소
      window.removeEventListener('beforeunload', () => handleUnload(currentParticipantListLength));
    };

    // 의존성 일단 보류
  }, []);
};

export default useRoomData;
