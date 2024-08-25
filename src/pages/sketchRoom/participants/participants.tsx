import styles from './participants.module.scss';

interface ParticipantsProps {
  nickName: string;
}

const Participants = ({ nickName }: ParticipantsProps) => {
  return <div>{nickName}</div>;
};

export default Participants;
