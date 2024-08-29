import { useCanvasStore } from "@src/stores/useCanvasStore";

export const usePixelateImage = (selectedPixelCount: number) => {
  const { setPixelatedData, setColorStats } = useCanvasStore();

  const handlePixelate = () => {
    const canvas = document.createElement("canvas");
    const originalCanvas = document.querySelector("canvas");
    if (!originalCanvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;

    const imageData = originalCanvas
      .getContext("2d")
      ?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;

    const data = imageData.data;

    const totalPixels = Math.sqrt(selectedPixelCount);
    const gridSizeX = Math.floor(canvas.width / totalPixels);
    const gridSizeY = Math.floor(canvas.height / totalPixels);
    const numColumns = Math.floor(canvas.width / gridSizeX);
    const numRows = Math.floor(canvas.height / gridSizeY);
    const adjustedGridSizeX = canvas.width / numColumns;
    const adjustedGridSizeY = canvas.height / numRows;

    const colorCount: { [color: string]: number } = {};

    // Step 1: 먼저 흰색 배경 설정
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Step 2: 그리드 생성
    context.strokeStyle = "#000000";
    context.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += adjustedGridSizeX) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 0; y <= canvas.height; y += adjustedGridSizeY) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    // Step 3: 이미지 픽셀화
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        let r = 0,
          g = 0,
          b = 0,
          count = 0; // 초기 색상을 0으로 설정

        const startX = Math.floor(x * adjustedGridSizeX);
        const startY = Math.floor(y * adjustedGridSizeY);
        const endX = Math.floor((x + 1) * adjustedGridSizeX);
        const endY = Math.floor((y + 1) * adjustedGridSizeY);

        for (let yy = startY; yy < endY; yy++) {
          for (let xx = startX; xx < endX; xx++) {
            const pixelIndex = (yy * canvas.width + xx) * 4;
            if (pixelIndex < data.length) {
              // 이미지 픽셀 색상 더하기
              r += data[pixelIndex];
              g += data[pixelIndex + 1];
              b += data[pixelIndex + 2];
              count++;
            }
          }
        }

        // 이미지 내에 픽셀이 있으면 평균 계산
        if (count > 0) {
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);

          const color = `rgb(${r},${g},${b})`;

          if (colorCount[color]) {
            colorCount[color]++;
          } else {
            colorCount[color] = 1;
          }

          // 계산된 색상으로 픽셀화
          context.fillStyle = color;
          context.fillRect(
            startX,
            startY,
            adjustedGridSizeX,
            adjustedGridSizeY
          );
        }
      }
    }

    // Step 4: 픽셀화된 데이터 저장
    setPixelatedData(canvas);
    setColorStats(colorCount);
  };

  return { handlePixelate };
};
