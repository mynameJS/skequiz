import { useEffect } from 'react';

// 이미지 비율 조절할때 해상도 꺠지는거 고쳐야됨

const useResizeCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (canvas && container) {
        // 기존 캔버스의 상태 저장
        const ctx = canvas.getContext('2d');
        const prevLineWidth = ctx?.lineWidth;
        const prevStrokeStyle = ctx?.strokeStyle;
        const prevFillStyle = ctx?.fillStyle;

        // 기존 캔버스의 내용을 데이터 URL로 저장
        const dataUrl = canvas.toDataURL();

        // 부모 컨테이너의 크기와 기존 캔버스 크기의 비율 계산
        const scaleWidth = container.clientWidth / canvas.width;
        const scaleHeight = container.clientHeight / canvas.height;
        const scale = Math.min(scaleWidth, scaleHeight);

        // 캔버스 크기 조정
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        if (ctx) {
          // 이전에 저장된 상태 복원
          ctx.lineWidth = prevLineWidth || 1;
          ctx.strokeStyle = prevStrokeStyle || '#000';
          ctx.fillStyle = prevFillStyle || '#000';

          // 저장된 이미지 데이터를 다시 그리기 (비율 조정)
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
            ctx.save();
            ctx.scale(scale, scale); // 비율 조정
            ctx.drawImage(img, 0, 0); // 이미지를 캔버스에 다시 그리기
            ctx.restore();
          };
        }
      }
    };

    resizeCanvas(); // 컴포넌트 마운트 시 크기 조정
    window.addEventListener('resize', resizeCanvas); // 창 크기 변경 시 크기 조정
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef, containerRef]);
};

export default useResizeCanvas;
