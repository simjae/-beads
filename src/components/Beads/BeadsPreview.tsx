"use client";
import { usePreviewStore } from "@src/stores/useCanvasStore";
import React, { useEffect, useRef } from "react";
import ColorStats from "@components/ColorStats/ColorStats";
import { TooltipProvider } from "@components/Shadcn/tooltip";
const BeadsPreview: React.FC = () => {
  const { pixelatedData } = usePreviewStore();
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

  return (
    <TooltipProvider>
      <div className="p-4">
        <canvas
          ref={previewRef}
          width={1024}
          height={1024}
          className="border border-gray-300 rounded-md"
        />
        <ColorStats />
      </div>
    </TooltipProvider>
  );
};

export default BeadsPreview;
