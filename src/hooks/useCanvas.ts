// useCanvas.ts
import { useCanvasStore, usePreviewStore } from "@src/stores/useCanvasStore";
import { useRef, useCallback } from "react";
import { useImageDragAndResize } from "./useImageDragAndResize";
import { useDrawCanvas } from "./useDrawCanvas";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { canvasWidth, canvasHeight, gridSize } = useCanvasStore();
  const { setPixelatedData, setColorStats } = usePreviewStore();

  const drawCanvas = useDrawCanvas(canvasRef);
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useImageDragAndResize(drawCanvas);

  const pixelateImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    drawCanvas(false); // 리사이징 핸들 제외하고 캔버스 그림

    context.drawImage(originalCanvas, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const pixelSize = 30; // 고정된 블록 크기

    const colorCount: { [color: string]: number } = {};

    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let yy = 0; yy < pixelSize; yy++) {
          for (let xx = 0; xx < pixelSize; xx++) {
            const pixelIndex = ((y + yy) * canvas.width + (x + xx)) * 4;
            if (pixelIndex < data.length) {
              r += data[pixelIndex];
              g += data[pixelIndex + 1];
              b += data[pixelIndex + 2];
              count++;
            }
          }
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const color = `rgb(${r},${g},${b})`;

        if (colorCount[color]) {
          colorCount[color]++;
        } else {
          colorCount[color] = 1;
        }

        context.fillStyle = color;
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }

    setPixelatedData(canvas);
    setColorStats(colorCount); // 색상별 픽셀 수를 저장
  }, [
    canvasWidth,
    canvasHeight,
    canvasRef,
    setPixelatedData,
    drawCanvas,
    setColorStats,
  ]);

  return {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  };
};
