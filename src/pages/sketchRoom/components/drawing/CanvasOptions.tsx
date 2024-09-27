import { MutableRefObject, useState } from 'react';
import { Socket } from 'socket.io-client';
import { COLOR_PRESET_TOP, COLOR_PRESET_BOTTOM, STROKE_SET } from '../../../../constant/canvasOptions';
import { ContextOption } from '../../../../types/drawing/interface';
import paperTrash from '../../../../assets/image/paper_trash.png';
import pencil from '../../../../assets/image/pencil.png';
import paintBucket from '../../../../assets/image/paint_bucket.png';
import styles from './CanvasOptions.module.scss';

interface CanvasOptions {
  isMyTurn: boolean;
  contextOption: ContextOption;
  socket: MutableRefObject<Socket | null>;
  setContextOption: React.Dispatch<React.SetStateAction<ContextOption>>;
  clearCanvas: () => void;
  setDrawMode: React.Dispatch<React.SetStateAction<'lineDraw' | 'fill'>>;
}

const CanvasOptions = ({
  isMyTurn,
  contextOption,
  socket,
  setContextOption,
  clearCanvas,
  setDrawMode,
}: CanvasOptions) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const topColorArr = Object.values(COLOR_PRESET_TOP);
  const bottomColorArr = Object.values(COLOR_PRESET_BOTTOM);

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
      // socket.current가 null이 아닌 경우에만 emit 호출
      if (socket.current) {
        socket.current.emit('updateContextOption', newContextOption);
      }
      return newContextOption;
    });
  };

  const toggleIsSelecting = () => {
    setIsSelecting(prevValue => !prevValue);
  };

  // 추후 추가구현 계획 보류 시 핸들러 합치기
  const handleLineDrawButtonClick = () => {
    setDrawMode('lineDraw');
  };

  const handleFillButtonClick = () => {
    setDrawMode('fill');
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
          {bottomColorArr.map(colorCode => (
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
      <div className={styles.drawButton}>
        <button>
          <img onClick={handleLineDrawButtonClick} className={styles.buttonImg} src={pencil} alt="연필" />
        </button>
      </div>
      <div className={styles.drawButton}>
        <button>
          <img onClick={handleFillButtonClick} className={styles.buttonImg} src={paintBucket} />
        </button>
      </div>
      <div className={styles.drawButton}>
        <button>
          <img onClick={clearCanvas} className={styles.buttonImg} src={paperTrash} alt="클리어" />
        </button>
      </div>
    </div>
  );
};

export default CanvasOptions;
