import { useRef } from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";

export const useImageResizeAndDrag = (drawCanvas: () => void) => {
  const { images, updateImage, selectImage } = useCanvasStore();
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const resizingRef = useRef<{ corner: string | null }>({ corner: null });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    resizingRef.current.corner = null;
    let isCornerClicked = false;

    for (let i = images.length - 1; i >= 0; i--) {
      const img = images[i];

      // 리사이징 핸들 클릭 확인
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
          resizingRef.current.corner = corner.name; // 리사이징 모드로 전환
          dragStartPosRef.current = { x: offsetX, y: offsetY };
          selectImage(img.id);
          isCornerClicked = true;
          return;
        }
      }

      // 이미지 영역 클릭 여부 확인
      if (
        !isCornerClicked && // 모서리가 클릭되지 않은 경우에만
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
      // 리사이징 처리
      const deltaX = offsetX - dragStartPosRef.current.x;
      const deltaY = offsetY - dragStartPosRef.current.y;

      const newProps = { ...selectedImage };

      switch (resizingRef.current.corner) {
        case "top-left":
          newProps.width = selectedImage.width + (selectedImage.x - offsetX);
          newProps.height = selectedImage.height + (selectedImage.y - offsetY);
          newProps.x = offsetX;
          newProps.y = offsetY;
          break;
        case "top-right":
          newProps.width = offsetX - selectedImage.x;
          newProps.height = selectedImage.height + (selectedImage.y - offsetY);
          newProps.y = offsetY;
          break;
        case "bottom-left":
          newProps.width = selectedImage.width + (selectedImage.x - offsetX);
          newProps.height = offsetY - selectedImage.y;
          newProps.x = offsetX;
          break;
        case "bottom-right":
          newProps.width = offsetX - selectedImage.x;
          newProps.height = offsetY - selectedImage.y;
          break;
        default:
          break;
      }

      updateImage(selectedImage.id, newProps);
      drawCanvas();
      dragStartPosRef.current = { x: offsetX, y: offsetY };
    } else if (dragStartPosRef.current) {
      // 이미지 드래그 처리
      updateImage(selectedImage.id, {
        x: offsetX - dragStartPosRef.current.x,
        y: offsetY - dragStartPosRef.current.y,
      });
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    resizingRef.current.corner = null; // 리사이징 종료
    dragStartPosRef.current = null;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
