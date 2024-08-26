import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './drawing.module.scss';

const Drawing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      // 기존 캔버스의 내용을 데이터 URL로 저장
      const dataUrl = canvas.toDataURL();

      // 부모 컨테이너의 크기에 맞게 캔버스 크기를 조정
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // 저장된 이미지 데이터를 다시 그리기
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  }, []);

  useEffect(() => {
    resizeCanvas(); // 컴포넌트 마운트 시 크기 조정
    window.addEventListener('resize', resizeCanvas); // 창 크기 변경 시 크기 조정
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent) => {
    if (context) {
      context.beginPath();
      context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent) => {
    if (isDrawing && context) {
      context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', border: '1px solid black' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Drawing;
