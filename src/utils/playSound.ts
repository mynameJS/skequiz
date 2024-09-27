import EnterRoom from '../assets/sound/enter_room.mp3';
import LeaveRoom from '../assets/sound/leave_room.mp3';
import CorrectAnswer from '../assets/sound/correctAnswer.mp3';
import SelectOption from '../assets/sound/pop.mp3';

const sounds = {
  enterRoom: { fileName: EnterRoom, volume: 1 },
  leaveRoom: { fileName: LeaveRoom, volume: 1 },
  correctAnswer: { fileName: CorrectAnswer, volume: 1 },
  selectOption: { fileName: SelectOption, volume: 1 },
};

export function playSound(soundName: keyof typeof sounds) {
  const { fileName, volume } = sounds[soundName];
  const audio = new Audio(fileName);
  audio.volume = volume;
  audio.play();
}
