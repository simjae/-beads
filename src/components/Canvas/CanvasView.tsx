"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const CanvasView: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(1024);
  const [canvasHeight, setCanvasHeight] = useState(1024);
  const [gridSize, setGridSize] = useState(20);
  const [gridColor, setGridColor] = useState("#ddd");
  const [imageOpacity, setImageOpacity] = useState(1);
  const [minScaleToShowBlocks, setMinScaleToShowBlocks] = useState(0.5);
  const [zoomSpeed, setZoomSpeed] = useState(0.1);
  const [draggingEnabled, setDraggingEnabled] = useState(true);
  const [blockCount, setBlockCount] = useState(1000); // 블록 개수
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
  const [previewData, setPreviewData] = useState<HTMLCanvasElement | null>(
    null
  );
  const [clickedBlockCoords, setClickedBlockCoords] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedImageRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const resizingRef = useRef<{ corner: string | null }>({ corner: null });

  useEffect(() => {
    // URL에서 줌 및 위치 정보를 가져오기
    const params = new URLSearchParams(window.location.search);
    const zoomParam = params.get("zoom");
    const xParam = params.get("x");
    const yParam = params.get("y");

    if (zoomParam) setCurrentScale(parseFloat(zoomParam));
    if (xParam && yParam)
      setPosition({ x: parseFloat(xParam), y: parseFloat(yParam) });
  }, []);

  const updateUrl = (zoom: number, x: number, y: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("zoom", zoom.toString());
    params.set("x", x.toString());
    params.set("y", y.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const calculateGridSize = useCallback(() => {
    const totalArea = canvasWidth * canvasHeight;
    const blockArea = totalArea / blockCount;
    return Math.sqrt(blockArea); // 한 블록의 크기를 결정
  }, [blockCount, canvasWidth, canvasHeight]);

  useEffect(() => {
    setGridSize(calculateGridSize());
  }, [calculateGridSize]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
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

        draw(); // 이미지가 로드된 후 캔버스를 다시 그립니다.
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingEnabled) return;

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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingEnabled) return;

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

  const drawGrid = useCallback(
    (
      context: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      gridSize = 20
    ) => {
      context.strokeStyle = gridColor;
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
    },
    [gridColor]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // 그리드 그리기
    drawGrid(context, canvas.width, canvas.height, gridSize);

    uploadedImages.forEach((img) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        context.globalAlpha = imageOpacity;
        context.drawImage(image, img.x, img.y, img.width, img.height);
        context.globalAlpha = 1;

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
      };
    });
  }, [uploadedImages, gridSize, gridColor, imageOpacity, drawGrid]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height;
      const previewContext = previewCanvas.getContext("2d");

      if (previewContext) {
        // 원본 이미지 그리기
        previewContext.drawImage(canvas, 0, 0);

        // 그리드 그리기
        drawGrid(previewContext, canvas.width, canvas.height, gridSize);

        setPreviewData(previewCanvas);
      }
    }
  };

  const handlePreviewClick = (e: any) => {
    if (!previewData) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = previewData.width / rect.width;
    const scaleY = previewData.height / rect.height;

    const canvasX = Math.floor(x * scaleX);
    const canvasY = Math.floor(y * scaleY);

    // 블록 단위 좌표 계산
    const blockX = Math.floor(canvasX / gridSize);
    const blockY = Math.floor(canvasY / gridSize);

    // 블록 인덱스 계산
    const blockIndex = blockY * Math.ceil(canvasWidth / gridSize) + blockX;

    setClickedBlockCoords({ x: blockX, y: blockY, index: blockIndex });
  };

  const handleResetPreview = () => {
    setPreviewData(null);
    setPosition({ x: 0, y: 0 });
    setCurrentScale(1);
  };

  const renderPreview = () => {
    if (!previewData) return null;

    return (
      <TransformWrapper
        initialScale={currentScale}
        initialPositionX={position.x}
        initialPositionY={position.y}
        wheel={{ step: zoomSpeed }}
        pinch={{ step: zoomSpeed }}
        doubleClick={{ mode: "reset" }}
        minScale={0.1}
        onZoom={(zoom) => {
          setCurrentScale(zoom.state.scale);
          updateUrl(
            zoom.state.scale,
            zoom.state.positionX,
            zoom.state.positionY
          );
        }}
        onPanningStop={(e) => {
          updateUrl(currentScale, e.state.positionX, e.state.positionY);
        }}
      >
        <TransformComponent>
          <div
            onClick={handlePreviewClick}
            style={{
              position: "relative",
              backgroundImage: `url(${previewData.toDataURL()})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: previewData.width,
              height: previewData.height,
              cursor: "pointer",
            }}
          >
            {currentScale >= minScaleToShowBlocks && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`,
                  gridTemplateRows: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`,
                  pointerEvents: "none",
                }}
              >
                {Array.from({
                  length: Math.ceil(previewData.width / gridSize),
                }).map((_, colIndex) =>
                  Array.from({
                    length: Math.ceil(previewData.height / gridSize),
                  }).map((_, rowIndex) => (
                    <div
                      key={`${colIndex}-${rowIndex}`}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        pointerEvents: "none",
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    );
  };

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4 relative w-full h-full">
      <h3 className="font-semibold">Canvas</h3>
      <div className="flex flex-col gap-2">
        <div>
          <label>캔버스 너비: </label>
          <input
            type="number"
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>캔버스 높이: </label>
          <input
            type="number"
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>블록 개수: </label>
          <input
            type="number"
            value={blockCount}
            onChange={(e) => setBlockCount(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>그리드 색상: </label>
          <input
            type="color"
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
          />
        </div>
        <div>
          <label>이미지 투명도: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={imageOpacity}
            onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>블록을 보여줄 최소 줌 레벨: </label>
          <input
            type="number"
            step="0.1"
            value={minScaleToShowBlocks}
            onChange={(e) =>
              setMinScaleToShowBlocks(parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label>줌 속도: </label>
          <input
            type="number"
            step="0.01"
            value={zoomSpeed}
            onChange={(e) => setZoomSpeed(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>드래그 활성화 여부: </label>
          <input
            type="checkbox"
            checked={draggingEnabled}
            onChange={(e) => setDraggingEnabled(e.target.checked)}
          />
        </div>
      </div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div className="flex gap-2">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleResetPreview}>Reset Preview</button>
      </div>
      <div
        className="relative bg-muted-foreground/10 rounded-md border-2 border-dashed border-muted-foreground/20"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
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

      <div>{renderPreview()}</div>
      {clickedBlockCoords && (
        <div>
          <p>Clicked Block Coordinates:</p>
          <p>
            X: {clickedBlockCoords.x}, Y: {clickedBlockCoords.y}, Index:{" "}
            {clickedBlockCoords.index}
          </p>
        </div>
      )}
    </div>
  );
};

export default CanvasView;
