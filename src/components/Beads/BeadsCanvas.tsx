"use client";

import { useCanvas } from "@src/hooks/useCanvas";
import { useZoomPanPinch } from "@src/hooks/useZoomPanPinch";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import React, { useRef, useEffect, useState } from "react";

interface BeadsCanvasProps {
  zoomPanEnabled: boolean;
}

const BeadsCanvas: React.FC<BeadsCanvasProps> = ({ zoomPanEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addImage, clearImages, setPixelCount } = useCanvasStore();
  const {
    drawCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pixelateImage,
  } = useCanvas(canvasRef);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const { ZoomPanPinchComponent } = useZoomPanPinch({
    initialScale: 1,
    zoomSpeed: 0.1,
  });

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

  useEffect(() => {
    if (canvasSize.width && canvasSize.height) {
      drawCanvas();
    }
  }, [canvasSize, drawCanvas]);

  return (
    <div className="p-4">
      {zoomPanEnabled ? (
        <ZoomPanPinchComponent>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border border-black-300 rounded-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </ZoomPanPinchComponent>
      ) : (
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border border-black-300 rounded-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
    </div>
  );
};

export default BeadsCanvas;
