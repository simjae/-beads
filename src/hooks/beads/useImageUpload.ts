import { useRef } from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import { calculateImagePosition } from "@src/lib/canvasHelpers";

export const useImageUpload = (
  drawCanvas: (canvas: HTMLCanvasElement | null) => void
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImage } = useCanvasStore();

  const handleFileUpload = () => {
    const files = fileInputRef.current?.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        const { newWidth, newHeight, newX, newY } = calculateImagePosition(
          image,
          window.innerWidth - 300,
          window.innerHeight * 0.8
        );

        addImage({
          id: Date.now(),
          src: imageUrl,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
          isSelected: false,
        });

        drawCanvas(null); // 이미지가 업로드된 후 캔버스를 다시 그림
      };
    });
  };

  return { fileInputRef, handleFileUpload };
};
