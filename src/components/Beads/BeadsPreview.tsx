"use client";
import { usePreviewStore } from "@src/stores/useCanvasStore";
import React, { useEffect, useRef, useState } from "react";
import ColorStats from "@components/ColorStats/ColorStats";
import { TooltipProvider } from "@components/Shadcn/tooltip";
import { colorQuantization } from "@src/lib/colorQuantization";
import { generateBeadPattern } from "@src/lib/generateBeadPattern";
import { Button } from "../Button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const BeadsPreview: React.FC = () => {
  const { pixelatedData, setBeadPattern, pixelCount } = usePreviewStore();
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState("pixelated"); // "zoom", "original", "pixelated"

  useEffect(() => {
    if (pixelatedData && previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const canvas = previewRef.current;

        // 한 변의 그리드 개수 계산
        const totalPixels = Math.sqrt(pixelCount);
        const gridSize = Math.min(
          Math.floor(canvas.width / totalPixels),
          Math.floor(canvas.height / totalPixels)
        );

        // 캔버스 크기를 픽셀 수와 그리드 크기에 맞게 조정
        canvas.width = totalPixels * gridSize;
        canvas.height = totalPixels * gridSize;

        // 캔버스를 흰색으로 채우기
        previewContext.fillStyle = "#ffffff";
        previewContext.fillRect(0, 0, canvas.width, canvas.height);

        // 이미지 그리기
        previewContext.drawImage(
          pixelatedData,
          0,
          0,
          canvas.width,
          canvas.height
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
        const simplifiedData = colorQuantization(imageData, 16); // 16개의 색상으로 단순화
        previewContext.putImageData(simplifiedData, 0, 0);

        // 비즈 패턴 생성
        const pattern = generateBeadPattern(simplifiedData);
        setBeadPattern(pattern);
      }
    }
  };

  const renderView = () => {
    switch (viewMode) {
      case "zoom":
        return (
          <TransformWrapper>
            <TransformComponent>
              <img
                src={pixelatedData?.toDataURL()}
                alt="Zoomable Preview"
                className="border border-gray-300 rounded-md"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </TransformComponent>
          </TransformWrapper>
        );
      case "original":
        return (
          <canvas
            ref={previewRef}
            width={pixelatedData?.width || 1024}
            height={pixelatedData?.height || 1024}
            className="border border-gray-300 rounded-md"
          />
        );
      case "pixelated":
      default:
        return (
          <canvas
            ref={previewRef}
            width={pixelatedData?.width || 1024}
            height={pixelatedData?.height || 1024}
            className="border border-gray-300 rounded-md"
          />
        );
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label>
          <input
            type="radio"
            name="viewMode"
            value="zoom"
            checked={viewMode === "zoom"}
            onChange={() => setViewMode("zoom")}
          />
          줌팬필
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="viewMode"
            value="original"
            checked={viewMode === "original"}
            onChange={() => setViewMode("original")}
          />
          원본 이미지
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="viewMode"
            value="pixelated"
            checked={viewMode === "pixelated"}
            onChange={() => setViewMode("pixelated")}
          />
          픽셀화
        </label>
      </div>

      {renderView()}

      <Button onClick={handleSimplify} className="mt-4">
        Simplify
      </Button>
      <ColorStats />
    </div>
  );
};

export default BeadsPreview;
