import { useState, useRef } from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";

export const useBeadsControl = () => {
  const [zoomPanEnabled, setZoomPanEnabled] = useState(true);
  const [previewZoomPanEnabled, setPreviewZoomPanEnabled] = useState(true);
  const [selectedPixelCount, setSelectedPixelCount] = useState(100);
  const [previewMode, setPreviewMode] = useState("pixelated");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    addImage,
    clearImages,
    setPixelCount,
    setPixelatedData,
    setColorStats,
    setBeadPattern,
  } = useCanvasStore();

  const handleZoomPanToggle = () => {
    const newValue = !zoomPanEnabled;
    setZoomPanEnabled(newValue);
  };

  const handlePreviewZoomPanToggle = () => {
    const newValue = !previewZoomPanEnabled;
    setPreviewZoomPanEnabled(newValue);
  };

  const handleFileUpload = () => {
    const files = fileInputRef.current?.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          const aspectRatio = image.width / image.height;
          const canvasWidth = window.innerWidth - 300;
          const canvasHeight = window.innerHeight * 0.8;
          let newWidth = canvasWidth / 4;
          let newHeight = newWidth / aspectRatio;
          const newX = (canvasWidth - newWidth) / 2;
          const newY = (canvasHeight - newHeight) / 2;

          addImage({
            id: Date.now(),
            src: imageUrl,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            isSelected: false,
          });
        };
      });
    }
  };

  const handleSaveCanvas = () => {
    // Save the current canvas as an image
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "canvas-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handlePixelate = () => {
    // Pixelate the image
    const canvas = document.createElement("canvas");
    const originalCanvas = document.querySelector("canvas");
    if (!originalCanvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;

    context.drawImage(originalCanvas, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const totalPixels = Math.sqrt(selectedPixelCount);
    const gridSizeX = Math.floor(canvas.width / totalPixels);
    const gridSizeY = Math.floor(canvas.height / totalPixels);
    const numColumns = Math.floor(canvas.width / gridSizeX);
    const numRows = Math.floor(canvas.height / gridSizeY);
    const adjustedGridSizeX = canvas.width / numColumns;
    const adjustedGridSizeY = canvas.height / numRows;

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
            const pixelIndex = (yy * canvas.width + xx) * 4;
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
        context.fillRect(startX, startY, adjustedGridSizeX, adjustedGridSizeY);
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
    setColorStats(colorCount);
  };

  const handleClear = () => {
    clearImages();
  };

  const handlePixelCountChange = (count: number) => {
    setSelectedPixelCount(count);
    setPixelCount(count);
  };

  const handlePreviewModeChange = (mode: string) => {
    setPreviewMode(mode);
  };

  return {
    zoomPanEnabled,
    previewZoomPanEnabled,
    selectedPixelCount,
    previewMode,
    fileInputRef,
    handleZoomPanToggle,
    handlePreviewZoomPanToggle,
    handleFileUpload,
    handleSaveCanvas,
    handlePixelate,
    handleClear,
    handlePixelCountChange,
    handlePreviewModeChange,
  };
};
