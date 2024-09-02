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
}
