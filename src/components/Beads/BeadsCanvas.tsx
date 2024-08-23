"use client";

import { useCanvas } from "@src/hooks/useCanvas";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import React, { useRef, useEffect } from "react";
import { Input } from "@components/Shadcn/input";
import { Button } from "@components/Shadcn/button";
const BizCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasWidth, canvasHeight, addImage, clearImages } = useCanvasStore();

  const {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  } = useCanvas(canvasRef);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          const aspectRatio = image.width / image.height;
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

          drawCanvas();
        };
      });
    }
  };

  const handleSave = () => {
    pixelateImage();
  };

  const handleClear = () => {
    clearImages();
    drawCanvas();
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border border-gray-300 rounded-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="mt-4 space-y-2">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default BizCanvas;
