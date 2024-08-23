import { useRef, useCallback } from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";

export const useImageDragAndResize = (drawCanvas: () => void) => {
  const { images, updateImage, selectImage } = useCanvasStore();
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const resizingRef = useRef<{ corner: string | null }>({ corner: null });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    for (let i = images.length - 1; i >= 0; i--) {
      const img = images[i];

      const corners = [
        { name: "top-left", x: img.x - 5, y: img.y - 5 },
        { name: "top-right", x: img.x + img.width - 5, y: img.y - 5 },
        { name: "bottom-left", x: img.x - 5, y: img.y + img.height - 5 },
        {
          name: "bottom-right",
          x: img.x + img.width - 5,
          y: img.y + img.height - 5,
        },
      ];

      for (const corner of corners) {
        if (
          offsetX > corner.x &&
          offsetX < corner.x + 10 &&
          offsetY > corner.y &&
          offsetY < corner.y + 10
        ) {
          resizingRef.current.corner = corner.name;
          dragStartPosRef.current = { x: offsetX, y: offsetY };
          return;
        }
      }

      if (
        offsetX > img.x &&
        offsetX < img.x + img.width &&
        offsetY > img.y &&
        offsetY < img.y + img.height
      ) {
        selectImage(img.id);
        dragStartPosRef.current = { x: offsetX - img.x, y: offsetY - img.y };
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const selectedImage = images.find((img) => img.isSelected);
    if (!selectedImage) return;

    if (resizingRef.current.corner && dragStartPosRef.current) {
      const deltaX = offsetX - dragStartPosRef.current.x;
      const deltaY = offsetY - dragStartPosRef.current.y;

      switch (resizingRef.current.corner) {
        case "top-left":
          updateImage(selectedImage.id, {
            x: offsetX,
            y: offsetY,
            width: selectedImage.width - deltaX,
            height: selectedImage.height - deltaY,
          });
          break;
        case "top-right":
          updateImage(selectedImage.id, {
            y: offsetY,
            width: selectedImage.width + deltaX,
            height: selectedImage.height - deltaY,
          });
          break;
        case "bottom-left":
          updateImage(selectedImage.id, {
            x: offsetX,
            width: selectedImage.width - deltaX,
            height: selectedImage.height + deltaY,
          });
          break;
        case "bottom-right":
          updateImage(selectedImage.id, {
            width: selectedImage.width + deltaX,
            height: selectedImage.height + deltaY,
          });
          break;
      }
      drawCanvas();
      dragStartPosRef.current = { x: offsetX, y: offsetY };
    } else if (dragStartPosRef.current) {
      updateImage(selectedImage.id, {
        x: offsetX - dragStartPosRef.current.x,
        y: offsetY - dragStartPosRef.current.y,
      });
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    resizingRef.current.corner = null;
    dragStartPosRef.current = null;
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
