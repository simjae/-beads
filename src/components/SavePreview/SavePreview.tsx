"use client";
import React, { useEffect, useRef } from "react";
import { useImageStore } from "@src/stores/useImageStore";
import dynamic from "next/dynamic";

const MyComponent = dynamic(() => import("./SavePreview"), { ssr: false });
const SavePreview: React.FC = () => {
  const { savedCanvasState } = useImageStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!savedCanvasState) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = savedCanvasState.canvasWidth;
    canvas.height = savedCanvasState.canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    savedCanvasState.images.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
      image.onload = () => {
        ctx.drawImage(image, img.x, img.y, img.width, img.height);
      };
    });

    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(canvasData, 0, 0);
  }, [savedCanvasState]);

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-semibold">Save Preview</h3>
      <div className="aspect-[4/3] bg-muted-foreground/10 rounded-md flex items-center justify-center">
        <canvas ref={canvasRef} style={{ width: "800px", height: "800px" }} />
      </div>
    </div>
  );
};

export default SavePreview;
