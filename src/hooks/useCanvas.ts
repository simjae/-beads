import { useCanvasStore } from "@src/stores/useCanvasStore";
import { useCallback } from "react";
import { useImageDragAndResize } from "./useImageDragAndResize";
import { useDrawCanvas } from "./useDrawCanvas";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const {
    canvasWidth,
    canvasHeight,
    pixelCount,
    setPixelatedData,
    setColorStats,
  } = useCanvasStore();

  const drawCanvas = useDrawCanvas(canvasRef);
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useImageDragAndResize(drawCanvas);

  const pixelateImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    // 캔버스의 너비와 높이
    const width = originalCanvas.width;
    const height = originalCanvas.height;

    // 한 변의 그리드 개수 계산
    const totalPixels = Math.sqrt(pixelCount);
    const gridSizeX = Math.floor(width / totalPixels);
    const gridSizeY = Math.floor(height / totalPixels);

    // 그리드 크기를 정확히 픽셀 카운트에 맞추기 위해, 가로/세로 칸 수 계산
    const numColumns = Math.floor(width / gridSizeX);
    const numRows = Math.floor(height / gridSizeY);

    // 그리드 칸 수가 정확히 픽셀 카운트와 일치하도록 조정
    const adjustedGridSizeX = width / numColumns;
    const adjustedGridSizeY = height / numRows;

    canvas.width = width;
    canvas.height = height;
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

    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        const startX = Math.floor(x * adjustedGridSizeX);
        const startY = Math.floor(y * adjustedGridSizeY);
        const endX = Math.floor((x + 1) * adjustedGridSizeX);
        const endY = Math.floor((y + 1) * adjustedGridSizeY);

        for (let yy = startY; yy < endY; yy++) {
          for (let xx = startX; xx < endX; xx++) {
            const pixelIndex = (yy * width + xx) * 4;
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
        context.fillRect(startX, startY, adjustedGridSizeX, adjustedGridSizeY);

        // 픽셀 테두리를 검은색으로 그리기
        context.strokeStyle = "#000000";
        context.strokeRect(
          startX,
          startY,
          adjustedGridSizeX,
          adjustedGridSizeY
        );
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
