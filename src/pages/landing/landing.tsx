import styles from './landing.module.scss';
import { useState } from 'react';
import useNavigateClick from '../../hooks/useNavigateClick';

const Landing = () => {
  const [userName, setUserName] = useState('');
  console.log(userName);
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
  const handleNavigateClick = useNavigateClick();
  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <input className={styles.inputBox} placeholder="Enter Your Name" onChange={handleUserNameChange} />
        <button className={styles.playButton} onClick={() => handleNavigateClick('/sketchRoom')}>
          Play
        </button>
        <button className={styles.CreateRoomButton}>Create Custom Room</button>
      </div>
    </div>
  );
};

export default Landing;
