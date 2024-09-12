import { UserDataType } from '../user/interface';

export interface DrawStartTime {
  seconds: number;
  nanoseconds: number;
}

export interface PlayGameState {
  playerLimit: number;
  currentDrawerIndex: number;
  wholeRound: number;
  currentRound: number;
  currentSuggestedWord: string;
  drawStartTime: DrawStartTime;
  drawLimitTime: number;
  isPlaying: boolean;
  isPublic: boolean;
}

export interface PlayingStepState {
  selectWord: boolean;
  nowDrawing: boolean;
  showResult: boolean;
  showTotalResult: boolean;
}

export interface RoomData {
  participants: UserDataType[];
  playerLimit: number;
  isPublic: boolean;
}

export interface GameRules {
  players: number;
  rounds: number;
  timeLimit: number;
}
