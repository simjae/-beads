import { useCanvasStore, usePreviewStore } from "@src/stores/useCanvasStore";
import { useRef, useCallback } from "react";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const {
    images,
    canvasWidth,
    canvasHeight,
    gridSize,
    gridColor,
    imageOpacity,
    updateImage,
    selectImage,
  } = useCanvasStore();
  const { setPixelatedData } = usePreviewStore();
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const resizingRef = useRef<{ corner: string | null }>({ corner: null });

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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    for (let i = images.length - 1; i >= 0; i--) {
      const img = images[i];

      const corners = [
        { name: "top-left", x: img.x - 5, y: img.y - 5 },
        { name: "top-right", x: img.x + img.width - 5, y: img.y - 5 },
        { name: "bottom-left", x: img.x - 5, y: img.y + img.height - 5 },
        {
          name: "bottom-right",
          x: img.x + img.width - 5,
          y: img.y + img.height - 5,
        },
      ];

      for (const corner of corners) {
        if (
          offsetX > corner.x &&
          offsetX < corner.x + 10 &&
          offsetY > corner.y &&
          offsetY < corner.y + 10
        ) {
          resizingRef.current.corner = corner.name;
          dragStartPosRef.current = { x: offsetX, y: offsetY };
          return;
        }
      }

      if (
        offsetX > img.x &&
        offsetX < img.x + img.width &&
        offsetY > img.y &&
        offsetY < img.y + img.height
      ) {
        selectImage(img.id);
        dragStartPosRef.current = { x: offsetX - img.x, y: offsetY - img.y };
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const selectedImage = images.find((img) => img.isSelected);
    if (!selectedImage) return;

    if (resizingRef.current.corner && dragStartPosRef.current) {
      const deltaX = offsetX - dragStartPosRef.current.x;
      const deltaY = offsetY - dragStartPosRef.current.y;

      switch (resizingRef.current.corner) {
        case "top-left":
          updateImage(selectedImage.id, {
            x: offsetX,
            y: offsetY,
            width: selectedImage.width - deltaX,
            height: selectedImage.height - deltaY,
          });
          break;
        case "top-right":
          updateImage(selectedImage.id, {
            y: offsetY,
            width: selectedImage.width + deltaX,
            height: selectedImage.height - deltaY,
          });
          break;
        case "bottom-left":
          updateImage(selectedImage.id, {
            x: offsetX,
            width: selectedImage.width - deltaX,
            height: selectedImage.height + deltaY,
          });
          break;
        case "bottom-right":
          updateImage(selectedImage.id, {
            width: selectedImage.width + deltaX,
            height: selectedImage.height + deltaY,
          });
          break;
      }
      drawCanvas();
      dragStartPosRef.current = { x: offsetX, y: offsetY };
    } else if (dragStartPosRef.current) {
      updateImage(selectedImage.id, {
        x: offsetX - dragStartPosRef.current.x,
        y: offsetY - dragStartPosRef.current.y,
      });
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    resizingRef.current.corner = null;
    dragStartPosRef.current = null;
  };

  const pixelateImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    const originalCanvas = canvasRef.current;
    if (!originalCanvas) return;

    context.drawImage(originalCanvas, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const pixelSize = 20; // 고정된 블록 크기

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

        context.fillStyle = `rgb(${r},${g},${b})`;
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }

    setPixelatedData(canvas);
  }, [canvasWidth, canvasHeight, canvasRef, setPixelatedData]);

  return {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  };
};
