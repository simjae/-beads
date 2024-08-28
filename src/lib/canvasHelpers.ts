// @src/utils/canvasHelpers.ts

/**
 * 캔버스에 그리드 선을 그리는 함수
 */
export const drawGrid = (
  context: CanvasRenderingContext2D,
  gridColor: string,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
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
};

/**
 * 이미지의 핸들(드래그 및 리사이즈 포인트)을 그리는 함수
 */
export const drawHandles = (
  context: CanvasRenderingContext2D,
  img: { x: number; y: number; width: number; height: number }
) => {
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
};

/**
 * 이미지를 캔버스에 맞게 위치와 크기를 계산하는 함수
 */
export const calculateImagePosition = (
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) => {
  const aspectRatio = image.width / image.height;
  const newWidth = canvasWidth / 4;
  const newHeight = newWidth / aspectRatio;
  const newX = (canvasWidth - newWidth) / 2;
  const newY = (canvasHeight - newHeight) / 2;

  return { newWidth, newHeight, newX, newY };
};
