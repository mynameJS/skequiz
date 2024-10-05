import { useEffect } from 'react';
import {
  togglePlayingState,
  updatePlayOrder,
  initParticipantsScore,
  updatePlayingStep,
} from '../../../services/sketchRoomService';
import { UserDataType } from '../../../types/user/interface';
import { useDrawStore } from '../../../store/drawStore';

interface UseGameStartParams {
  participantList: UserDataType[];
  updateClearCanvasTrigger: () => void;
  updateIsGuideTurn: (state: boolean) => void;
  playingStep: string;
  currentRoomId: string;
  isRoomOwner: boolean;
  isAllPass: boolean;
  isPlaying: boolean;
  currentSuggestedWord: string;
  remainingTime: number;
  currentRound: number;
  currentDrawerId: string;
  isPublic: boolean;
  isCustomGameRuleOpen: boolean;
  ControlCustomGameRule: (state: boolean) => void;
}

const useGameStart = ({
  participantList,
  updateIsGuideTurn,
  playingStep,
  updateClearCanvasTrigger,
  currentRoomId,
  isRoomOwner,
  isAllPass,
  isPlaying,
  currentSuggestedWord,
  remainingTime,
  currentRound,
  currentDrawerId,
  isPublic,
  ControlCustomGameRule,
}: UseGameStartParams) => {
  const tempPrevDrawerId = useDrawStore(state => state.tempDrawerId);
  const updateTempPrevDrawerId = useDrawStore(state => state.setTempDrawerId);

  useEffect(() => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const gameStart = async () => {
      // Public 룸이면서
      // 게임 중 아니면서 혼자 방에 있다면
      // WaitingOtherPlayers GuideBoard 렌더링
      if (isPublic && !isPlaying && participantList.length < 2) {
        updateIsGuideTurn(true);
        return;
      }

      // Public 룸이면서
      // 내가 방장이면서 방 인원수 2명이상이고 게임중이 아니라면
      // (게임 자동 시작 트리거)
      if (isPublic && isRoomOwner && participantList.length > 1 && !isPlaying) {
        await togglePlayingState(currentRoomId);
        return;
      }

      // 게임 중 상황
      if (isPlaying) {
        // 출제자 변경 감지
        // 출제자가 제시어 선택 후 nowDrawing 단계에서 접속이 끊길 경우 대비하여
        // 현재 출제자의 id를 전역상태관리
        if (tempPrevDrawerId !== currentDrawerId) {
          updateTempPrevDrawerId(currentDrawerId);
        }

        // 모든 스텝이 초기화 상태라면
        if (playingStep === 'waiting') {
          // SelectWord 단계 돌입
          // 방장만 호출
          if (isRoomOwner) {
            await updatePlayingStep(currentRoomId, 'selectWord');
          }
          // SelectWord GuideBoard 렌더링
          updateIsGuideTurn(true);

          return;
        }

        // SelectWord 단계
        if (playingStep === 'selectWord') {
          // 참가자가 방을 떠나 게임이 불가능한 경우 (1인)
          if (participantList.length < 2) {
            // 게임 상태 초기화
            // 혼자 있기 때문에 if 로직 안넣어도됨
            await togglePlayingState(currentRoomId);
            // 스코어 초기화
            await initParticipantsScore(currentRoomId, true);
            // 단계 초기화
            await updatePlayingStep(currentRoomId, 'waiting');

            // private Room 이라면
            if (!isPublic) {
              ControlCustomGameRule(true);
            }
            return;
          }

          // 제시어가 선택되었고, 남은시간이 0초가 아니라면
          if (currentSuggestedWord !== '' && remainingTime !== 0) {
            // GuideBoard 언마운트
            updateIsGuideTurn(false);
            // nowDrawing 단계 돌입
            // 방장만 호출
            if (isRoomOwner) {
              await updatePlayingStep(currentRoomId, 'nowDrawing');
              // 캔버스 초기화
              updateClearCanvasTrigger();
            }
            return;
          }
        }

        // nowDrawing 단계
        if (playingStep === 'nowDrawing') {
          // 출제자가 nowDrawing 단계에서 방을 떠날 경우 대비하여
          // 현재 참여자 리스트에 전역상태로 저장해 놓은 출제자 id가 포함되어 있는지 확인
          const isCurrentDrawerStillInGame = participantList.some(user => user.id === tempPrevDrawerId);

          // nowDrawing 단계에서 출제자가 방을 떠날 시
          if (!isCurrentDrawerStillInGame) {
            // 바로 다음 순서인 플레이어에게 출제권 넘김
            // 혹은 마지막 게임이었다면 게임 종료
            const isNextRound = await updatePlayOrder(currentRoomId, isRoomOwner);

            // 잔여 라운드가 있다면
            if (isNextRound) {
              // 초기단계로 돌아감(방장만)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'waiting');
                return;
              }
            } else {
              // 잔여 라운드가 없다면
              // showTotalResult 단계 돌입(방장만 호출)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'showTotalResult');
              }
              // showTotalResult GuideBoard 렌더링
              updateIsGuideTurn(true);

              // 종합 결과창 5초 보여준 후
              await delay(5000);

              // showTotalResult GuideBoard 언마운트
              updateIsGuideTurn(false);

              // 단계 초기화 (방장만 호출)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'waiting');
                // 전체 스코어 및 답변여부 초기화
                await initParticipantsScore(currentRoomId, true);
                // 게임 상태 false
                await togglePlayingState(currentRoomId);
              }

              // private room 이라면?
              // CustomGameRule 컴포넌트 호출
              if (!isPublic) {
                ControlCustomGameRule(true);
                updateIsGuideTurn(false);
              }
            }
            return;
          }

          // 제한시간이 다 됬거나, 모든 참여자가 정답을 맞췄을 경우
          if (remainingTime === 0 || isAllPass) {
            // showResult 단계 돌입(방장만 호출)
            if (isRoomOwner) {
              await updatePlayingStep(currentRoomId, 'showResult');
            }
            // showResult GuideBoard 렌더링
            updateIsGuideTurn(true);

            // 결과창 3초 보여준 후
            await delay(3000);

            // showResult GuideBoard 언마운트
            updateIsGuideTurn(false);

            const isNextRound = await updatePlayOrder(currentRoomId, isRoomOwner);

            // 잔여 라운드가 있다면
            if (isNextRound) {
              // 초기단계로 돌아감(방장만)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'waiting');
                return;
              }
            } else {
              // 잔여 라운드가 없다면
              // showTotalResult 단계 돌입(방장만 호출)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'showTotalResult');
              }
              // showTotalResult GuideBoard 렌더링
              updateIsGuideTurn(true);

              // 종합 결과창 5초 보여준 후
              await delay(5000);

              // showTotalResult GuideBoard 언마운트
              updateIsGuideTurn(false);

              // 단계 초기화 (방장만 호출)
              if (isRoomOwner) {
                await updatePlayingStep(currentRoomId, 'waiting');
                // 전체 스코어 및 답변여부 초기화
                await initParticipantsScore(currentRoomId, true);
                // 게임 상태 false
                await togglePlayingState(currentRoomId);
              }

              // private room 이라면?
              // CustomGameRule 컴포넌트 호출
              if (!isPublic) {
                ControlCustomGameRule(true);
                updateIsGuideTurn(false);
              }
            }
          }
        }
      }
    };
    gameStart();
  }, [
    participantList.length,
    isAllPass,
    isPlaying,
    remainingTime,
    currentSuggestedWord,
    isRoomOwner,
    playingStep,
    currentRound,
    currentDrawerId,
    currentRoomId,
    isPublic,
  ]);
};

export default useGameStart;
