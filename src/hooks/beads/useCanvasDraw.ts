import { useCanvasStore } from "@src/stores/useCanvasStore";
import { useCallback, useState } from "react";

export const useCanvasDraw = () => {
  const { images, gridSize, gridColor, imageOpacity } = useCanvasStore();
  const [loadedImages, setLoadedImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  // 이미지 로딩 관리 함수
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
    });
  };

  const drawCanvas = useCallback(
    async (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // 오프스크린 캔버스 생성
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offscreenContext = offscreenCanvas.getContext("2d");
      if (!offscreenContext) return;

      // 이미지 로딩 상태 관리
      const imageLoadPromises = images.map((img) => {
        if (loadedImages[img.src]) {
          return Promise.resolve(loadedImages[img.src]); // 이미 로드된 이미지 사용
        } else {
          return loadImage(img.src).then((image) => {
            setLoadedImages((prev) => ({ ...prev, [img.src]: image }));
            return image;
          });
        }
      });

      const loadedImagesResult = await Promise.all(imageLoadPromises);

      // 오프스크린 캔버스를 초기화
      offscreenContext.clearRect(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      );

      // 그리드 그리기
      offscreenContext.strokeStyle = gridColor;
      offscreenContext.lineWidth = 0.5;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        offscreenContext.beginPath();
        offscreenContext.moveTo(x, 0);
        offscreenContext.lineTo(x, canvas.height);
        offscreenContext.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        offscreenContext.beginPath();
        offscreenContext.moveTo(0, y);
        offscreenContext.lineTo(canvas.width, y);
        offscreenContext.stroke();
      }

      // 이미지 그리기
      loadedImagesResult.forEach((image, index) => {
        const imgData = images[index];
        offscreenContext.globalAlpha = imageOpacity;
        offscreenContext.drawImage(
          image,
          imgData.x,
          imgData.y,
          imgData.width,
          imgData.height
        );
        offscreenContext.globalAlpha = 1;

        // 선택된 이미지에 리사이징 핸들 그리기
        if (imgData.isSelected) {
          offscreenContext.fillStyle = "blue";
          const corners = [
            { x: imgData.x - 5, y: imgData.y - 5 },
            { x: imgData.x + imgData.width - 5, y: imgData.y - 5 },
            { x: imgData.x - 5, y: imgData.y + imgData.height - 5 },
            {
              x: imgData.x + imgData.width - 5,
              y: imgData.y + imgData.height - 5,
            },
          ];
          corners.forEach((corner) => {
            offscreenContext.fillRect(corner.x, corner.y, 10, 10);
          });
        }
      });

      // 메인 캔버스로 복사
      requestAnimationFrame(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(offscreenCanvas, 0, 0);
      });
    },
    [images, gridSize, gridColor, imageOpacity, loadedImages]
  );

  return { drawCanvas };
};
