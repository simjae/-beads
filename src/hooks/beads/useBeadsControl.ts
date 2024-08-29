import { useState, useRef } from "react";
import { useCanvasDraw } from "@src/hooks/beads/useCanvasDraw";
import { useImageUpload } from "@src/hooks/beads/useImageUpload";
import { useZoomPan } from "@src/hooks/beads/useZoomPan";
import { usePixelateImage } from "@src/hooks/beads/usePixelateImage";
import { useImageResizeAndDrag } from "@src/hooks/beads/useImageResizeAndDrag";
import { useCanvasStore } from "@src/stores/useCanvasStore";

export const useBeadsControl = () => {
  // 상태 관리
  const [selectedPixelCount, setSelectedPixelCount] = useState(100);
  const [previewMode, setPreviewMode] = useState("pixelated");
  const [isImageSelected, setIsImageSelected] = useState(false); // 이미지 선택 상태 관리
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const { drawCanvas } = useCanvasDraw();
  const { fileInputRef, handleFileUpload } = useImageUpload(() =>
    drawCanvas(canvasRef.current)
  );
  const {
    zoomPanEnabled,
    previewZoomPanEnabled,
    handleZoomPanToggle,
    handlePreviewZoomPanToggle,
  } = useZoomPan();
  const { handlePixelate } = usePixelateImage(selectedPixelCount);
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useImageResizeAndDrag(() => drawCanvas(canvasRef.current));

  const { pixelatedData, clearImages, setPixelCount, images } =
    useCanvasStore();

  // 마우스 다운 이벤트 처리
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { offsetX, offsetY } = e.nativeEvent;

    // 이미지 클릭 여부 확인
    const clickedImage = images.find(
      (img) =>
        offsetX >= img.x &&
        offsetX <= img.x + img.width &&
        offsetY >= img.y &&
        offsetY <= img.y + img.height
    );

    if (clickedImage) {
      // 이미지 클릭 시: 이미지 이동/리사이징 활성화
      e.stopPropagation(); // 이벤트 전파 중지
      setIsImageSelected(true); // 이미지 선택 상태 설정
      isDraggingRef.current = true;
      handleMouseDown(e);
    } else {
      // 빈 공간 클릭 시: 줌/팬 활성화
      setIsImageSelected(false); // 이미지 선택 상태 해제
      isDraggingRef.current = false;
    }
  };

  // 마우스 이동 이벤트 처리
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      e.stopPropagation(); // 이벤트 전파 중지
      handleMouseMove(e); // 드래그 중이면 이미지 이동/리사이징
    }
  };

  // 마우스 업 이벤트 처리
  const onMouseUp = () => {
    handleMouseUp();
    isDraggingRef.current = false;
    setIsImageSelected(false); // 드래그 종료 시 이미지 선택 상태 해제
  };

  const handleClear = () => {
    clearImages();
    drawCanvas(canvasRef.current);
  };

  const handlePixelCountChange = (count: number) => {
    setSelectedPixelCount(count);
    setPixelCount(count);
  };

  const handlePreviewModeChange = (mode: string) => {
    setPreviewMode(mode);
  };

  return {
    pixelatedData,
    zoomPanEnabled: zoomPanEnabled && !isImageSelected, // 이미지가 선택된 경우 줌/팬 비활성화
    previewZoomPanEnabled,
    selectedPixelCount,
    previewMode,
    fileInputRef,
    handleZoomPanToggle,
    handlePreviewZoomPanToggle,
    handleFileUpload,
    handleSaveCanvas: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement("a");
        link.download = "canvas-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    },
    handlePixelate,
    handleClear,
    handlePixelCountChange,
    handlePreviewModeChange,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawCanvas: () => drawCanvas(canvasRef.current),
    canvasRef,
  };
};
