import { useCallback, useEffect } from 'react';

const useResizeCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      // 기존 캔버스의 내용을 데이터 URL로 저장
      const dataUrl = canvas.toDataURL();

      // 부모 컨테이너의 크기에 맞게 캔버스 크기 조정
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
  }, [canvasRef, containerRef]);

  useEffect(() => {
    resizeCanvas(); // 컴포넌트 마운트 시 크기 조정
    window.addEventListener('resize', resizeCanvas); // 창 크기 변경 시 크기 조정
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);
};

export default useResizeCanvas;
