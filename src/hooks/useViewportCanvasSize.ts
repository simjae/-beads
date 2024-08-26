import { useState, useEffect } from "react";

export const useViewportCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight * 0.8, // 화면 높이의 80%를 사용
      });
    };

    // 컴포넌트가 마운트될 때와 윈도우 리사이즈 시에 캔버스 크기 업데이트
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return canvasSize;
};
