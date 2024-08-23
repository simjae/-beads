import { useCallback } from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";

export const useDrawCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const {
    images,
    canvasWidth,
    canvasHeight,
    gridSize,
    gridColor,
    imageOpacity,
  } = useCanvasStore();

  const drawGrid = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.strokeStyle = gridColor;
      context.lineWidth = 0.5;

      for (let x = 0; x <= canvasWidth; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvasHeight);
        context.stroke();
      }

      for (let y = 0; y <= canvasHeight; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
        context.stroke();
      }
    },
    [gridColor, gridSize, canvasWidth, canvasHeight]
  );

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Create an offscreen canvas for double buffering
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenContext = offscreenCanvas.getContext("2d");
    if (!offscreenContext) return;

    offscreenContext.clearRect(
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    drawGrid(offscreenContext);

    images.forEach((img) => {
      const image = new Image();
      image.src = img.src;

      image.onload = () => {
        offscreenContext.globalAlpha = imageOpacity;
        offscreenContext.drawImage(image, img.x, img.y, img.width, img.height);
        offscreenContext.globalAlpha = 1;

        if (img.isSelected) {
          offscreenContext.fillStyle = "blue";
          const corners = [
            { x: img.x - 5, y: img.y - 5 },
            { x: img.x + img.width - 5, y: img.y - 5 },
            { x: img.x - 5, y: img.y + img.height - 5 },
            { x: img.x + img.width - 5, y: img.y + img.height - 5 },
          ];

          corners.forEach((corner) => {
            offscreenContext.fillRect(corner.x, corner.y, 10, 10);
          });
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(offscreenCanvas, 0, 0);
      };
    });
  }, [images, gridSize, gridColor, imageOpacity, drawGrid, canvasRef]);

  return drawCanvas;
};
