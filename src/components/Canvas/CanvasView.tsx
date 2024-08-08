import React, { useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Resizable } from "re-resizable";
import Draggable from "react-draggable";
import { useImageStore } from "@src/stors/useImageStore";

const CanvasView: React.FC = () => {
  const { uploadedImages, tileSize, saveCanvasState, updateImage } =
    useImageStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    uploadedImages.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
      image.onload = () => {
        ctx.drawImage(image, img.x, img.y, img.width, img.height);
      };
    });

    for (let y = 0; y < canvas.height; y += tileSize) {
      for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.strokeStyle = "lightgray";
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    saveCanvasState({
      images: uploadedImages,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    console.log(uploadedImages);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parentElement = canvas.parentElement;
    if (!parentElement) return;

    canvas.width = parentElement.clientWidth;
    canvas.height = parentElement.clientHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    uploadedImages.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
      image.onload = () => {
        ctx.drawImage(image, img.x, img.y, img.width, img.height);
      };
    });

    for (let y = 0; y < canvas.height; y += tileSize) {
      for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.strokeStyle = "lightgray";
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }, [uploadedImages, tileSize]);

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4 relative w-full h-full">
      <h3 className="font-semibold">Canvas</h3>
      <div className="relative w-full h-full bg-muted-foreground/10 rounded-md border-2 border-dashed border-muted-foreground/20">
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          wheel={{ disabled: false }} // 마우스 휠 줌 활성화
          pinch={{ disabled: false }} // 핀치 줌 활성화
        >
          <TransformComponent>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              {uploadedImages.map((img, index) => (
                <Draggable
                  key={index}
                  defaultPosition={{ x: img.x, y: img.y }}
                  onStop={(e, data) => {
                    updateImage(index, { ...img, x: data.x, y: data.y });
                  }}
                >
                  <Resizable
                    size={{ width: img.width, height: img.height }}
                    onResizeStop={(e, direction, ref, d) => {
                      updateImage(index, {
                        ...img,
                        width: img.width + d.width,
                        height: img.height + d.height,
                      });
                    }}
                  >
                    <img
                      src={img.src}
                      alt="Uploaded"
                      style={{
                        width: img.width,
                        height: img.height,
                        position: "absolute",
                      }}
                    />
                  </Resizable>
                </Draggable>
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        저장
      </button>
    </div>
  );
};

export default CanvasView;
