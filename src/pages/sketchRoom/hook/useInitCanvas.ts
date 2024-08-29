import { useEffect } from 'react';

interface CanvasOptions {
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  strokeStyle?: string;
}

const useInitCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setContext: (context: CanvasRenderingContext2D) => void,
  options: CanvasOptions = {}
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = options.lineWidth ?? 2;
        ctx.lineCap = options.lineCap ?? 'round';
        ctx.strokeStyle = options.strokeStyle ?? 'black';
        setContext(ctx);
      }
    }
  }, [canvasRef, options, setContext]);
};

export default useInitCanvas;