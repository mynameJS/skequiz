import { useState, useEffect } from 'react';
import { patchContentList, patchTodoList } from '../../../../constant/patchContents';
import styles from './PatchNote.module.scss';

const PatchNote = () => {
  const [onNote, setOnNote] = useState(false);

  const onDoNotShowToday = () => {
    const today = String(new Date().getDay());
    localStorage.setItem('noteClickedDay', today);
    toggleOnNote();
  };

  const toggleOnNote = () => {
    setOnNote(prevValue => !prevValue);
  };

  useEffect(() => {
    const saveDay = localStorage.getItem('noteClickedDay');
    const today = String(new Date().getDay());
    // 안보기 누른 날짜와 오늘이 같지 않다면 note 노출
    const isNoteOn = saveDay !== today;

    if (isNoteOn) {
      setOnNote(true);
    }
  }, []);

  if (!onNote) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.title}>개발 노트</p>
        <div className={styles.patchList}>
          {patchContentList.map((item, index) => (
            <div key={item.content} className={styles.patchItem}>
              <p>{item.updateDate}</p>
              <p>
                {index + 1}. {item.content}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.patchList}>
          <p>업데이트 예정</p>
          {patchTodoList.map((item, index) => (
            <div key={item} className={styles.patchItem}>
              <p>
                {index + 1}. {item}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button onClick={onDoNotShowToday}>오늘 하루 열지 않음</button>
          <button onClick={toggleOnNote}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PatchNote;
