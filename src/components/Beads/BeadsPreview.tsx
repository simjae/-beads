"use client";
import { usePreviewStore } from "@src/stores/useCanvasStore";
import React, { useEffect, useRef, useState } from "react";
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
        previewContext.clearRect(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );
        previewContext.drawImage(pixelatedData, 0, 0);
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
        console.log(pattern);
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
