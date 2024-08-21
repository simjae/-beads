import React, { useState, useRef, useEffect } from "react";

const CanvasView: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<
    {
      id: number;
      src: string;
      x: number;
      y: number;
      width: number;
      height: number;
      isSelected: boolean;
    }[]
  >([]);
  const [nextId, setNextId] = useState(0);
  const [previewData, setPreviewData] = useState<ImageData | null>(null);
  const [clickedBlockCoords, setClickedBlockCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedImageRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const resizingRef = useRef<{ corner: string | null }>({ corner: null });

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
            isSelected: false,
          },
        ]);
        setNextId((id) => id + 1);
      };
    }
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    selectedImageRef.current = null;
    resizingRef.current.corner = null;

    for (let i = uploadedImages.length - 1; i >= 0; i--) {
      const img = uploadedImages[i];

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
          // 리사이징 핸들 클릭
          selectedImageRef.current = img.id;
          resizingRef.current.corner = corner.name;
          return;
        }
      }

      if (
        offsetX > img.x &&
        offsetX < img.x + img.width &&
        offsetY > img.y &&
        offsetY < img.y + img.height
      ) {
        // 이미지 클릭
        selectedImageRef.current = img.id;
        dragStartPosRef.current = { x: offsetX - img.x, y: offsetY - img.y };
        setUploadedImages((prevImages) =>
          prevImages.map((image) =>
            image.id === img.id
              ? { ...image, isSelected: true }
              : { ...image, isSelected: false }
          )
        );
        return;
      }
    }

    if (selectedImageRef.current === null) {
      // 클릭이 이미지 영역 외부인 경우 선택 해제
      setUploadedImages((prevImages) =>
        prevImages.map((image) => ({ ...image, isSelected: false }))
      );
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (selectedImageRef.current !== null) {
      setUploadedImages((prevImages) =>
        prevImages.map((img) => {
          if (img.id === selectedImageRef.current) {
            if (resizingRef.current.corner) {
              // 리사이징 중
              const newProps = { ...img };

              switch (resizingRef.current.corner) {
                case "top-left":
                  newProps.width = img.width + (img.x - offsetX);
                  newProps.height = img.height + (img.y - offsetY);
                  newProps.x = offsetX;
                  newProps.y = offsetY;
                  break;
                case "top-right":
                  newProps.width = offsetX - img.x;
                  newProps.height = img.height + (img.y - offsetY);
                  newProps.y = offsetY;
                  break;
                case "bottom-left":
                  newProps.width = img.width + (img.x - offsetX);
                  newProps.height = offsetY - img.y;
                  newProps.x = offsetX;
                  break;
                case "bottom-right":
                  newProps.width = offsetX - img.x;
                  newProps.height = offsetY - img.y;
                  break;
                default:
                  break;
              }

              return newProps;
            } else if (dragStartPosRef.current) {
              // 드래그 중
              const newX = offsetX - dragStartPosRef.current.x;
              const newY = offsetY - dragStartPosRef.current.y;
              return { ...img, x: newX, y: newY };
            }
          }
          return img;
        })
      );
    }
  };

  const handleMouseUp = () => {
    selectedImageRef.current = null;
    dragStartPosRef.current = null;
    resizingRef.current.corner = null;
  };

  const drawGrid = (context, canvasWidth, canvasHeight, gridSize = 20) => {
    context.strokeStyle = "#ddd";
    context.lineWidth = 0.5;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.stroke();
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 그리드 그리기
    drawGrid(context, canvas.width, canvas.height);

    uploadedImages.forEach((img) => {
      const image = new Image();
      image.src = img.src;
      context.drawImage(image, img.x, img.y, img.width, img.height);

      if (img.isSelected) {
        // 선택된 이미지에 리사이징 핸들 그리기
        context.fillStyle = "blue";
        const corners = [
          { x: img.x - 5, y: img.y - 5 },
          { x: img.x + img.width - 5, y: img.y - 5 },
          { x: img.x - 5, y: img.y + img.height - 5 },
          { x: img.x + img.width - 5, y: img.y + img.height - 5 },
        ];

        corners.forEach((corner) => {
          context.fillRect(corner.x, corner.y, 10, 10);
        });
      }
    });
  };

  useEffect(() => {
    draw();
  }, [uploadedImages]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        setPreviewData(imageData);
      }
    }
  };

  const handleBlockClick = (x: number, y: number) => {
    setClickedBlockCoords({ x, y });
  };

  const renderPreview = () => {
    if (!previewData) return null;

    const blockSize = 10; // 블록 크기 설정
    const rows = Math.ceil(previewData.height / blockSize);
    const cols = Math.ceil(previewData.width / blockSize);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${blockSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${blockSize}px)`,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const x = colIndex * blockSize;
            const y = rowIndex * blockSize;
            const index = (y * previewData.width + x) * 4;

            const r = previewData.data[index];
            const g = previewData.data[index + 1];
            const b = previewData.data[index + 2];
            const a = previewData.data[index + 3] / 255;

            const color = `rgba(${r},${g},${b},${a})`;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleBlockClick(colIndex, rowIndex)}
                style={{
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: color,
                  border: "1px solid #ddd", // 그리드 선 그리기
                  cursor: "pointer",
                }}
              />
            );
          })
        )}
      </div>
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
          maxWidth: "800px",
          maxHeight: "600px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            backgroundColor: "white",
            touchAction: "none",
            cursor: resizingRef.current.corner ? "nwse-resize" : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <div>{renderPreview()}</div>
      {clickedBlockCoords && (
        <div>
          <p>Clicked Block Coordinates:</p>
          <p>
            X: {clickedBlockCoords.x}, Y: {clickedBlockCoords.y}
          </p>
        </div>
      )}
    </div>
  );
};

export default CanvasView;
