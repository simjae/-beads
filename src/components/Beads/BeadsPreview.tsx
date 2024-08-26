"use client";
import { usePreviewStore } from "@src/stores/useCanvasStore";
import React, { useEffect, useRef } from "react";
import ColorStats from "@components/ColorStats/ColorStats";
import { TooltipProvider } from "@components/Shadcn/tooltip";
import { colorQuantization } from "@src/lib/colorQuantization";
import { generateBeadPattern } from "@src/lib/generateBeadPattern";
import { Button } from "../Button";

const BeadsPreview: React.FC = () => {
  const { pixelatedData, setBeadPattern } = usePreviewStore();
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pixelatedData && previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const canvas = previewRef.current;

        // 캔버스 크기를 이미지 크기와 일치시킴
        canvas.width = pixelatedData.width;
        canvas.height = pixelatedData.height;

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
  }, [pixelatedData]);

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

  return (
    <div className="p-4">
      <canvas
        ref={previewRef}
        width={1024}
        height={1024}
        className="border border-gray-300 rounded-md"
      />
      <Button onClick={handleSimplify}>Simplify</Button>
      <ColorStats />
    </div>
  );
};

export default BeadsPreview;
