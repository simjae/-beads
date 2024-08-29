"use client";

import React, { useEffect } from "react";
import { useBeadsControl } from "@src/hooks/beads/useBeadsControl";

import { useZoomPanPinch } from "@src/hooks/useZoomPanPinch";
import { Card, CardContent } from "@components/Shadcn/card";
import useResponsiveCanvasSize from "@src/hooks/useResponsiveCanvasSize";

const BeadsCanvas: React.FC = () => {
  const {
    zoomPanEnabled,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawCanvas,
    canvasRef,
  } = useBeadsControl();

  const { ZoomPanPinchComponent } = useZoomPanPinch({
    initialScale: 1,
    zoomSpeed: 0.1,
    isZoomDisabled: !zoomPanEnabled,
    isPanDisabled: !zoomPanEnabled,
  });

  const canvasSize = useResponsiveCanvasSize();

  useEffect(() => {
    if (canvasSize.width && canvasSize.height) {
      drawCanvas();
    }
  }, [canvasSize, drawCanvas]);

  return (
    <Card className="p-4 shadow-md rounded-md max-w-full mx-auto">
      <CardContent>
        <ZoomPanPinchComponent>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border border-gray-300 rounded-md w-full max-w-full"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          />
        </ZoomPanPinchComponent>
      </CardContent>
    </Card>
  );
};

export default BeadsCanvas;
