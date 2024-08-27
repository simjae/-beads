// SimplifiedBeadsPreview.tsx
"use client";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import React, { useEffect, useRef } from "react";

const SimplifiedBeadsPreview: React.FC = () => {
  const { beadPattern } = useCanvasStore();
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (beadPattern.length > 0 && previewRef.current) {
      const previewContext = previewRef.current.getContext("2d");
      if (previewContext) {
        const cellWidth = previewRef.current.width / beadPattern[0].length;
        const cellHeight = previewRef.current.height / beadPattern.length;

        beadPattern.forEach((row, rowIndex) => {
          row.forEach((color, colIndex) => {
            previewContext.fillStyle = color;
            previewContext.fillRect(
              colIndex * cellWidth,
              rowIndex * cellHeight,
              cellWidth,
              cellHeight
            );
          });
        });
      }
    }
  }, [beadPattern]);

  return (
    <div className="p-4">
      <canvas
        ref={previewRef}
        width={1024}
        height={1024}
        className="border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default SimplifiedBeadsPreview;
