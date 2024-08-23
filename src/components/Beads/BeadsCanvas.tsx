"use client";

import { useCanvas } from "@src/hooks/useCanvas";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@components/Shadcn/input";
import { Button } from "@components/Shadcn/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/Shadcn/select";

const BeadsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasWidth, canvasHeight, addImage, clearImages, setPixelCount } =
    useCanvasStore();
  const {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  } = useCanvas(canvasRef);

  const [selectedPixelCount, setSelectedPixelCount] = useState(100); // Default pixel count

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
    setPixelCount(selectedPixelCount); // Update pixel count in store
    pixelateImage(); // Apply pixelation with the selected pixel count
  };

  const handleClear = () => {
    clearImages();
    drawCanvas();
  };

  const handlePixelCountChange = (value: string) => {
    setSelectedPixelCount(parseInt(value, 10));
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
        <div className="flex items-center space-x-2">
          <Select
            value={selectedPixelCount.toString()}
            onValueChange={handlePixelCountChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select pixel count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 피스</SelectItem>
              <SelectItem value="10">200 피스</SelectItem>
              <SelectItem value="20">3000 피스</SelectItem>
              <SelectItem value="30">10000 피스</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeadsCanvas;
