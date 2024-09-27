import { useRef, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import useSocketDrawing from '../../hook/useSocketDrawing';
import useInitCanvas from '../../hook/useInitCanvas';
import useResizeCanvas from '../../hook/useResizeCanvas';
import CanvasOptions from './CanvasOptions';
import { floodFill } from '../../../../utils/floodFill';
import { ContextOption } from '../../../../types/drawing/interface';
import styles from './Drawing.module.scss';

interface DrawingProps {
  isMyTurn: boolean;
  clearCanvasTrigger: boolean;
  drawMode: string;
  setDrawMode: React.Dispatch<React.SetStateAction<'lineDraw' | 'fill'>>;
}

const Drawing = ({ isMyTurn, clearCanvasTrigger, drawMode, setDrawMode }: DrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const [contextOption, setContextOption] = useState<ContextOption>({
    lineWidth: 2,
    strokeStyle: 'black',
  });

  const socket = useRef<Socket | null>(null); // 초기에는 null로 설정

  useInitCanvas(canvasRef, setContext, contextOption);
  useResizeCanvas(canvasRef, containerRef);
  useSocketDrawing({ socket: socket.current, context, canvasRef, isMyTurn });

  const startDrawing = async (event: React.MouseEvent) => {
    if (context && isMyTurn && socket.current) {
      context.beginPath();
      context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
      socket.current.emit('startDrawing'); // 선 시작 이벤트 전송
    }
  };

  const draw = (event: React.MouseEvent) => {
    if (isDrawing && context && isMyTurn && socket.current) {
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
        socket.current.emit('drawing', { x: relativeX, y: relativeY });
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing && context && isMyTurn && socket.current) {
      context.closePath();
      setIsDrawing(false);
      socket.current.emit('stopDrawing'); // 선 종료 이벤트 전송
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && context && socket.current) {
      context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스의 전체 영역 지우기
      socket.current.emit('clearCanvas'); // 캔버스 초기화 이벤트 전송
    }
  };

  const fillArea = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (drawMode === 'fill') {
      const canvas = canvasRef.current;
      if (canvas && context && socket.current) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        // 캔버스의 현재 크기를 기준으로 비율 계산
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const relativeX = x / canvasWidth;
        const relativeY = y / canvasHeight;
        const fillColor = contextOption.strokeStyle;

        floodFill(canvas, x, y, fillColor);

        // 서버에 색칠된 좌표 및 색상 전송 (비율로 변환)
        socket.current.emit('fillArea', { x: relativeX, y: relativeY, fillColor });
      }
    }
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_NODE_SOCKET_URL); // 소켓 연결 설정
    const socketInstance = socket.current;

    return () => {
      socketInstance.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
    };
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  useEffect(() => {
    clearCanvas();
  }, [clearCanvasTrigger]);

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onClick={fillArea}
      />
      <CanvasOptions
        isMyTurn={isMyTurn}
        contextOption={contextOption}
        socket={socket}
        setContextOption={setContextOption}
        clearCanvas={clearCanvas}
        setDrawMode={setDrawMode}
      />
    </div>
  );
};

export default Drawing;
