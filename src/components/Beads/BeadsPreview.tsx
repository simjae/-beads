"use client";

import React, { useEffect, useRef, useState } from "react";
import { colorQuantization } from "@src/lib/colorQuantization";
import { generateBeadPattern } from "@src/lib/generateBeadPattern";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import { useZoomPanPinch } from "@src/hooks/useZoomPanPinch";
import { Button } from "../Button";

interface BeadsPreviewProps {
  zoomPanEnabled: boolean;
  previewMode: string;
}

const BeadsPreview: React.FC<BeadsPreviewProps> = ({
  zoomPanEnabled,
  previewMode,
}) => {
  const { pixelatedData, setBeadPattern, pixelCount } = useCanvasStore();
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState(0);

  const { ZoomPanPinchComponent } = useZoomPanPinch({
    initialScale: 1,
    zoomSpeed: 0.1,
  });

  useEffect(() => {
    if (pixelatedData && previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const totalPixels = Math.sqrt(pixelCount);
        const gridSizeCalculated = Math.floor(window.innerWidth / totalPixels);
        setGridSize(gridSizeCalculated);

        previewRef.current.width = gridSizeCalculated * totalPixels;
        previewRef.current.height = gridSizeCalculated * totalPixels;

        previewContext.fillStyle = "#ffffff";
        previewContext.fillRect(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );

        previewContext.drawImage(
          pixelatedData,
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );
      }
    }
  }, [pixelatedData, pixelCount]);

  const handleSimplify = () => {
    if (previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const imageData = previewContext.getImageData(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );
        const simplifiedData = colorQuantization(imageData, 16);
        previewContext.putImageData(simplifiedData, 0, 0);

        const pattern = generateBeadPattern(simplifiedData);
        setBeadPattern(pattern);
      }
    }
  };

  const renderBeadPattern = () => {
    if (pixelatedData && previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const totalPixels = Math.sqrt(pixelCount);

        previewRef.current.width = gridSize * totalPixels;
        previewRef.current.height = gridSize * totalPixels;

        previewContext.fillStyle = "#ffffff";
        previewContext.fillRect(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );

        for (let y = 0; y < totalPixels; y++) {
          for (let x = 0; x < totalPixels; x++) {
            previewContext.strokeStyle = "#000000";
            previewContext.strokeRect(
              x * gridSize,
              y * gridSize,
              gridSize,
              gridSize
            );

            previewContext.fillStyle = "#000000";
            previewContext.font = `${gridSize / 2}px Arial`;
            previewContext.fillText(
              `${x + 1}`,
              x * gridSize + gridSize / 3,
              y * gridSize + gridSize / 1.5
            );
          }
        }
      }
    }
  };

  const renderView = () => {
    switch (previewMode) {
      case "beadPattern":
        return (
          <canvas
            ref={previewRef}
            className="border border-gray-300 rounded-md"
          />
        );
      case "original":
        return (
          <img
            src={pixelatedData?.toDataURL()}
            alt="Original Preview"
            className="border border-gray-300 rounded-md"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        );
      case "pixelated":
      default:
        return (
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            {zoomPanEnabled ? (
              <ZoomPanPinchComponent>
                <canvas
                  ref={previewRef}
                  className="border border-gray-300 rounded-md"
                  style={{
                    display: "block",
                  }}
                />
              </ZoomPanPinchComponent>
            ) : (
              <canvas
                ref={previewRef}
                className="border border-gray-300 rounded-md"
                style={{
                  display: "block",
                }}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {renderView()}
      <Button onClick={handleSimplify} className="mt-4">
        Simplify
      </Button>
    </div>
  );
};

export default BeadsPreview;
