import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { PointData } from '../../../types/drawing/interface';

interface UseSocketDrawingProps {
  socket: Socket;
  context: CanvasRenderingContext2D | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isMyTurn: boolean;
}

const useSocketDrawing = ({ socket, context, canvasRef, isMyTurn }: UseSocketDrawingProps) => {
  useEffect(() => {
    if (isMyTurn) return; // 출제자의 경우 자신의 화면에서 실시간으로 그림을 업데이트

    // 선 그리기 시작 이벤트를 받으면 새로운 선을 시작
    socket.on('startDrawing', () => {
      if (context) {
        context.beginPath();
      }
    });

    // 선 그리기 좌표 데이터를 받음
    socket.on('drawing', (data: PointData) => {
      const canvas = canvasRef.current;
      if (canvas && context) {
        const absoluteX = data.x * canvas.width;
        const absoluteY = data.y * canvas.height;

        context.lineTo(absoluteX, absoluteY);
        context.stroke();
      }
    });

    // 선 그리기 종료 이벤트를 받으면 현재 선을 종료
    socket.on('stopDrawing', () => {
      if (context) {
        context.closePath();
      }
    });

    // 캔버스 초기화 이벤트를 받으면 캔버스를 지움
    socket.on('clearCanvas', () => {
      const canvas = canvasRef.current;
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    // 색상 및 선 굵기 업데이트 이벤트를 받으면 옵션을 업데이트
    socket.on('updateContextOption', newContextOption => {
      if (context) {
        context.lineWidth = newContextOption.lineWidth;
        context.strokeStyle = newContextOption.strokeStyle;
      }
    });

    return () => {
      socket.off('startDrawing');
      socket.off('drawing');
      socket.off('stopDrawing');
      socket.off('updateContextOption');
    };
  }, [isMyTurn, context, canvasRef, socket]);
};

export default useSocketDrawing;
