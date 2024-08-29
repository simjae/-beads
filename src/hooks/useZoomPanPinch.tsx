import { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface UseZoomPanPinchProps {
  initialScale?: number;
  initialPositionX?: number;
  initialPositionY?: number;
  zoomSpeed?: number;
  onZoomChange?: (scale: number) => void;
  onPanningStop?: (positionX: number, positionY: number) => void;
  onClick?: (x: number, y: number, canvasX: number, canvasY: number) => void;
  isZoomDisabled?: boolean;
  isPanDisabled?: boolean;
}

export const useZoomPanPinch = ({
  initialScale = 1,
  initialPositionX = 0,
  initialPositionY = 0,
  zoomSpeed = 0.1,
  onZoomChange,
  onPanningStop,
  onClick,
  isZoomDisabled = false,
  isPanDisabled = false,
}: UseZoomPanPinchProps) => {
  const [currentScale, setCurrentScale] = useState(initialScale);
  const [position, setPosition] = useState({
    x: initialPositionX,
    y: initialPositionY,
  });
  console.log("isZoomDisabled:", isZoomDisabled);
  console.log("isPanDisabled:", isPanDisabled);
  const ZoomPanPinchComponent = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <TransformWrapper
        initialScale={currentScale}
        initialPositionX={position.x}
        initialPositionY={position.y}
        wheel={{ disabled: isZoomDisabled, step: zoomSpeed }}
        pinch={{ disabled: isZoomDisabled, step: zoomSpeed }}
        panning={{ disabled: isPanDisabled }}
        doubleClick={{ mode: "reset" }}
        minScale={0.1}
        onZoom={(zoom) => {
          const newScale = zoom.state.scale;
          setCurrentScale(newScale);
          if (onZoomChange) {
            onZoomChange(newScale);
          }
        }}
        onPanningStop={(e) => {
          const { positionX, positionY } = e.state;
          setPosition({ x: positionX, y: positionY });
          if (onPanningStop) {
            onPanningStop(positionX, positionY);
          }
        }}
      >
        <TransformComponent
          wrapperClass="transform-wrapper"
          contentClass="transform-content"
        >
          <div
            onClick={(e) => {
              if (onClick && e.currentTarget) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const scaleX = e.currentTarget.offsetWidth / rect.width;
                const scaleY = e.currentTarget.offsetHeight / rect.height;
                const canvasX = Math.floor(x * scaleX);
                const canvasY = Math.floor(y * scaleY);
                onClick(x, y, canvasX, canvasY);
              }
            }}
          >
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
    ),
    [
      currentScale,
      position.x,
      position.y,
      zoomSpeed,
      onZoomChange,
      onPanningStop,
      onClick,
      isZoomDisabled,
      isPanDisabled,
    ]
  );

  return {
    ZoomPanPinchComponent,
    currentScale,
    position,
  };
};
