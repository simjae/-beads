import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const CanvasView: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<
    {
      id: number;
      src: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }[]
  >([]);
  const [nextId, setNextId] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState(false); // 드래깅 상태 관리
  const [isResizing, setIsResizing] = useState(false); // 리사이징 상태 관리

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = image.width / image.height;

        let newWidth = canvasWidth / 2;
        let newHeight = canvasHeight / 2;

        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }

        const newX = (canvasWidth - newWidth) / 2;
        const newY = (canvasHeight - newHeight) / 2;

        setUploadedImages((prevImages) => [
          ...prevImages,
          {
            id: nextId,
            src: imageUrl,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          },
        ]);
        setNextId((id) => id + 1);
      };
    }
  };

  const handleUpdateImage = (
    id: number,
    newProps: Partial<{ x: number; y: number; width: number; height: number }>
  ) => {
    setUploadedImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, ...newProps } : img))
    );
  };

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4 relative w-full h-full">
      <h3 className="font-semibold">Canvas</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div
        className="relative bg-muted-foreground/10 rounded-md border-2 border-dashed border-muted-foreground/20"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "800px", // 고정된 최대 캔버스 너비
          maxHeight: "600px", // 고정된 최대 캔버스 높이
          overflow: "hidden", // 캔버스 영역 밖은 보이지 않게
          position: "relative",
        }}
      >
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          wheel={{ step: 0.1 }} // 마우스 휠로 줌 인/아웃
          pinch={{ step: 0.1 }} // 터치 패드 핀치 줌
          doubleClick={{ mode: "reset" }} // 더블 클릭으로 줌 리셋
          panning={{ disabled: isDragging || isResizing }} // 드래그, 리사이징 시 panning 비활성화
        >
          <TransformComponent>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <canvas
                ref={canvasRef}
                width={800} // 캔버스 너비 설정
                height={600} // 캔버스 높이 설정
                style={{
                  backgroundColor: "white",
                  touchAction: "none", // 모바일에서 터치 지원
                }}
              />
              {uploadedImages.map((img) => (
                <Draggable
                  key={img.id}
                  position={{ x: img.x, y: img.y }}
                  onStart={() => setIsDragging(true)}
                  onStop={(e, data) => {
                    handleUpdateImage(img.id, { x: data.x, y: data.y });
                    setIsDragging(false);
                  }}
                  bounds="parent"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: img.y,
                      left: img.x,
                      width: img.width,
                      height: img.height,
                    }}
                  >
                    <Resizable
                      size={{ width: img.width, height: img.height }}
                      onResizeStart={() => setIsResizing(true)}
                      onResizeStop={(e, direction, ref, d) => {
                        handleUpdateImage(img.id, {
                          width: img.width + d.width,
                          height: img.height + d.height,
                        });
                        setIsResizing(false);
                      }}
                      enable={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true,
                      }}
                    >
                      <img
                        src={img.src}
                        alt="Uploaded"
                        style={{
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none", // 드래그 문제 해결
                        }}
                        draggable={false} // 이미지 자체 드래그 방지
                      />
                    </Resizable>
                  </div>
                </Draggable>
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default CanvasView;
