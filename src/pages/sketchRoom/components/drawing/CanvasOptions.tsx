import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { COLOR_PRESET_TOP, COLOR_PRESET_BOTTOM, STROKE_SET } from '../../../../constant/canvasOptions';
import { ContextOption } from '../../../../types/drawing/interface';
import trashBin from '../../../../assets/trash_bin.svg';
import styles from './CanvasOptions.module.scss';

interface CanvasOptions {
  isMyTurn: boolean;
  contextOption: ContextOption;
  socket: React.MutableRefObject<Socket>;
  setContextOption: React.Dispatch<React.SetStateAction<ContextOption>>;
  clearCanvas: () => void;
}

const CanvasOptions = ({ isMyTurn, contextOption, socket, setContextOption, clearCanvas }: CanvasOptions) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const topColorArr = Object.values(COLOR_PRESET_TOP);
  const bottomColorArr2 = Object.values(COLOR_PRESET_BOTTOM);

  const selectContextOption = (optionName: string, selectedValue: string | number) => {
    if (optionName === 'lineWidth') {
      toggleIsSelecting();
    }
    setContextOption(prevContextOption => {
      const newContextOption = {
        ...prevContextOption,
        [optionName]: selectedValue,
      };
      // 변경된 옵션을 소켓 서버에 전송
      socket.current.emit('updateContextOption', newContextOption);
      return newContextOption;
    });
  };

  const toggleIsSelecting = () => {
    setIsSelecting(prevValue => !prevValue);
  };

  if (!isMyTurn) return null;

  return (
    <div className={styles.options}>
      <div className={styles.selectedColor} style={{ backgroundColor: contextOption.strokeStyle }}></div>
      <div className={styles.selectColor}>
        <div className={styles.colorList}>
          {topColorArr.map(colorCode => (
            <div
              key={colorCode}
              className={styles.topColorSwatch}
              style={{ backgroundColor: colorCode }}
              onClick={() => selectContextOption('strokeStyle', colorCode)}></div>
          ))}
        </div>
        <div className={styles.colorList}>
          {bottomColorArr2.map(colorCode => (
            <div
              key={colorCode}
              className={styles.bottomColorSwatch}
              style={{ backgroundColor: colorCode }}
              onClick={() => selectContextOption('strokeStyle', colorCode)}></div>
          ))}
        </div>
      </div>
      <div className={styles.selectLineWidth}>
        <button onClick={toggleIsSelecting}>
          <div
            style={{
              width: contextOption.lineWidth * 1.5,
              height: contextOption.lineWidth * 1.5,
            }}></div>
        </button>
        {isSelecting && (
          <ul className={styles.lineWidthList}>
            {STROKE_SET.map(width => (
              <li key={width} className={styles.lineWidth} onClick={() => selectContextOption('lineWidth', width)}>
                <div
                  style={{
                    width: width * 1.5,
                    height: width * 1.5,
                  }}></div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.deleteCanvas}>
        <button onClick={clearCanvas}>
          <img className={styles.trashBin} src={trashBin} alt="클리어" />
        </button>
      </div>
    </div>
  );
};

export default CanvasOptions;
