import { useRef, useState, useEffect } from 'react';
import useSocketDrawing from '../../hook/useSocketDrawing';
import useInitCanvas from '../../hook/useInitCanvas';
import useResizeCanvas from '../../hook/useResizeCanvas';
import { COLOR_PRESET_TOP, COLOR_PRESET_BOTTOM, STROKE_SET } from '../../../../constant/canvasOptions';
import io from 'socket.io-client';
import { ContextOption } from '../../../../types/drawing/interface';
import styles from './Drawing.module.scss';

interface DrawingProps {
  isMyTurn: boolean;
}

const Drawing = ({ isMyTurn }: DrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [contextOption, setContextOption] = useState<ContextOption>({
    lineWidth: 2,
    strokeStyle: 'black',
  });

  const toggleIsSelecting = () => {
    setIsSelecting(prevValue => !prevValue);
  };

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
      socket.emit('updateContextOption', newContextOption);
      return newContextOption;
    });
  };

  // 이것도 나중에 useEffect로 빼기
  const socket = io(import.meta.env.VITE_NODE_SOCKET_URL);

  useInitCanvas(canvasRef, setContext, contextOption);
  useResizeCanvas(canvasRef, containerRef);
  useSocketDrawing({ socket, context, canvasRef, isMyTurn });

  const startDrawing = async (event: React.MouseEvent) => {
    if (context && isMyTurn) {
      context.beginPath();
      context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
      socket.emit('startDrawing'); // 선 시작 이벤트 전송
    }
  };

  const draw = (event: React.MouseEvent) => {
    if (isDrawing && context && isMyTurn) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;

      // 캔버스의 현재 크기를 기준으로 비율 계산
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const relativeX = x / canvasWidth;
        const relativeY = y / canvasHeight;

        context.lineTo(x, y);
        context.stroke();

        // 비율로 변환한 좌표 데이터를 서버에 전송
        socket.emit('drawing', { x: relativeX, y: relativeY });
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing && context && isMyTurn) {
      context.closePath();
      setIsDrawing(false);
      socket.emit('stopDrawing'); // 선 종료 이벤트 전송
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스의 전체 영역 지우기
      socket.emit('clearCanvas'); // 캔버스 초기화 이벤트 전송
    }
  };

  const colorArr = Object.values(COLOR_PRESET_TOP);
  const colorArr2 = Object.values(COLOR_PRESET_BOTTOM);

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className={styles.options}>
        <div className={styles.selectColor}>
          <div className={styles.colorList}>
            {colorArr.map(colorCode => (
              <div
                key={colorCode}
                className={styles.colorSwatch}
                style={{ backgroundColor: colorCode }}
                onClick={() => selectContextOption('strokeStyle', colorCode)}></div>
            ))}
          </div>
          <div className={styles.colorList}>
            {colorArr2.map(colorCode => (
              <div
                key={colorCode}
                className={styles.colorSwatch}
                style={{ backgroundColor: colorCode }}
                onClick={() => selectContextOption('strokeStyle', colorCode)}></div>
            ))}
          </div>
        </div>
        <div className={styles.selectLineWidth}>
          <button onClick={toggleIsSelecting}>선굵기</button>
          {isSelecting && (
            <ul className={styles.lineWidthList}>
              {STROKE_SET.map(width => (
                <li key={width} className={styles.lineWidth} onClick={() => selectContextOption('lineWidth', width)}>
                  <div
                    style={{
                      width: width * 2,
                      height: width * 2,
                    }}></div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.eraser}>
          <button>지우개</button>
        </div>
        <div className={styles.deleteCanvas}>
          <button onClick={clearCanvas}>캔버스 롤백</button>
        </div>
      </div>
    </div>
  );
};

export default Drawing;
