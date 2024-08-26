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
  const { addImage, clearImages, setPixelCount } = useCanvasStore();
  const {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  } = useCanvas(canvasRef);

  const [selectedPixelCount, setSelectedPixelCount] = useState(100); // Default pixel count
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Safely access window object inside useEffect
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth - 300,
        height: window.innerHeight * 0.8,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          const aspectRatio = image.width / image.height;
          let newWidth = canvasSize.width / 4;
          let newHeight = newWidth / aspectRatio;
          const newX = (canvasSize.width - newWidth) / 2;
          const newY = (canvasSize.height - newHeight) / 2;

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
    if (canvasSize.width && canvasSize.height) {
      drawCanvas();
    }
  }, [canvasSize, drawCanvas]);

  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-black-300 rounded-md"
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
              <SelectItem value="100">100 칸</SelectItem>
              <SelectItem value="500">500 칸</SelectItem>
              <SelectItem value="1000">1000 칸</SelectItem>
              <SelectItem value="2000">2000 칸</SelectItem>
              <SelectItem value="5000">5000 칸</SelectItem>
              <SelectItem value="10000">10000 칸</SelectItem>
              <SelectItem value="20000">20000 칸</SelectItem>
              <SelectItem value="50000">50000 칸</SelectItem>
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
