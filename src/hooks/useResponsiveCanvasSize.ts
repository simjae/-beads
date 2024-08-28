// hooks/useResponsiveCanvasSize.ts
import { useState, useEffect } from "react";

const useResponsiveCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width >= 1024) {
        // Desktop
        setCanvasSize({
          width: width * 0.8,
          height: height * 0.8,
        });
      } else if (width >= 640) {
        // Tablet
        setCanvasSize({
          width: width * 0.6,
          height: height * 0.6,
        });
      } else {
        // Mobile
        setCanvasSize({
          width: width * 0.9,
          height: height * 0.4,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return canvasSize;
};

export default useResponsiveCanvasSize;
