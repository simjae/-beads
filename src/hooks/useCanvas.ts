import { useCanvasStore, usePreviewStore } from "@src/stores/useCanvasStore";
import { useCallback } from "react";
import { useImageDragAndResize } from "./useImageDragAndResize";
import { useDrawCanvas } from "./useDrawCanvas";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { canvasWidth, canvasHeight, pixelCount } = useCanvasStore();
  const { setPixelatedData, setColorStats } = usePreviewStore();

  const drawCanvas = useDrawCanvas(canvasRef);
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useImageDragAndResize(drawCanvas);

  const pixelateImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    // 한 변의 그리드 개수 계산
    const totalPixels = Math.sqrt(pixelCount);
    const gridSize = Math.min(
      Math.floor(originalCanvas.width / totalPixels),
      Math.floor(originalCanvas.height / totalPixels)
    );

    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    // 캔버스를 흰색으로 채우기
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawCanvas(false); // 리사이징 핸들 제외하고 캔버스 그림

    context.drawImage(originalCanvas, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCount: { [color: string]: number } = {};

    for (let y = 0; y < canvas.height; y += gridSize) {
      for (let x = 0; x < canvas.width; x += gridSize) {
        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let yy = 0; yy < gridSize; yy++) {
          for (let xx = 0; xx < gridSize; xx++) {
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

        // 픽셀 영역 그리기
        context.fillStyle = color;
        context.fillRect(x, y, gridSize, gridSize);

        // 픽셀 테두리를 검은색으로 그리기
        context.strokeStyle = "#000000";
        context.strokeRect(x, y, gridSize, gridSize);
      }
    }

    setPixelatedData(canvas);
    setColorStats(colorCount); // 색상별 픽셀 수를 저장
  }, [
    canvasRef,
    setPixelatedData,
    drawCanvas,
    setColorStats,
    pixelCount, // 사용자가 선택한 칸 수에 따라 그리드 크기 결정
  ]);

  return {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  };
};
