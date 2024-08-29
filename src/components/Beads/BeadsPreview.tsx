"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useBeadsControl } from "@src/hooks/beads/useBeadsControl";
import { useZoomPanPinch } from "@src/hooks/useZoomPanPinch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/Shadcn/card";
import useResponsiveCanvasSize from "@src/hooks/useResponsiveCanvasSize";

const BeadsPreview: React.FC = () => {
  const { previewZoomPanEnabled, previewMode, pixelatedData } =
    useBeadsControl();
  const previewRef = useRef<HTMLCanvasElement>(null);
  const { ZoomPanPinchComponent, currentScale, position } = useZoomPanPinch({
    initialScale: 1,
    zoomSpeed: 0.1,
    isZoomDisabled: !previewZoomPanEnabled,
    isPanDisabled: !previewZoomPanEnabled,
  });

  const canvasSize = useResponsiveCanvasSize();
  const animationFrameRef = useRef<number | null>(null);

  // 이미지 렌더링 함수
  const renderImage = useCallback(() => {
    if (previewRef.current && pixelatedData) {
      const context = previewRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );

        // 흰색 배경에 검은 선 그리기
        context.fillStyle = "#ffffff"; // 흰색 배경
        context.fillRect(
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );

        // 그리드 그리기
        context.strokeStyle = "#000000"; // 검은 선
        context.lineWidth = 0.5;
        const gridSize = 20; // 원하는 픽셀 크기로 설정
        for (let x = 0; x <= previewRef.current.width; x += gridSize) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, previewRef.current.height);
          context.stroke();
        }
        for (let y = 0; y <= previewRef.current.height; y += gridSize) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(previewRef.current.width, y);
          context.stroke();
        }

        // 이미지 렌더링
        context.save();
        const canvasMidX = previewRef.current.width / 2;
        const canvasMidY = previewRef.current.height / 2;

        context.translate(canvasMidX, canvasMidY);
        context.scale(currentScale, currentScale);
        context.translate(
          -canvasMidX + position.x / currentScale,
          -canvasMidY + position.y / currentScale
        );

        context.drawImage(
          pixelatedData,
          0,
          0,
          previewRef.current.width,
          previewRef.current.height
        );

        context.restore();
      }
    }
  }, [pixelatedData, currentScale, position]);

  useEffect(() => {
    // `requestAnimationFrame`을 사용하여 부드러운 렌더링 적용
    const handleRender = () => {
      renderImage();
      animationFrameRef.current = requestAnimationFrame(handleRender);
    };

    handleRender(); // 초기 렌더링

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current); // 애니메이션 중지
      }
    };
  }, [renderImage]);

  return (
    <Card className="p-4 shadow-md rounded-md max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <ZoomPanPinchComponent>
          <canvas
            ref={previewRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border border-gray-300 rounded-md w-full max-w-full"
            style={{ display: "block" }}
          />
        </ZoomPanPinchComponent>
      </CardContent>
    </Card>
  );
};

export default BeadsPreview;
