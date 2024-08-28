import { useRef, useEffect, useState, useCallback } from 'react';
import useSocketDrawing from '../hook/useSocketDrawing';
import useInitCanvas from '../hook/useInitCanvas';
import useResizeCanvas from '../hook/useResizeCanvas';
import styles from './drawing.module.scss';
import io from 'socket.io-client';

interface DrawingProps {
  isMyTurn: boolean;
}

const socket = io(import.meta.env.VITE_NODE_SOCKET_URL);

const Drawing = ({ isMyTurn }: DrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useInitCanvas(canvasRef, setContext);
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
    </div>
  );
};

export default Drawing;
