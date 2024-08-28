// @src/hooks/beads/useZoomPan.ts
import { useState } from "react";

export const useZoomPan = () => {
  const [zoomPanEnabled, setZoomPanEnabled] = useState(true);
  const [previewZoomPanEnabled, setPreviewZoomPanEnabled] = useState(true);

  const handleZoomPanToggle = () => setZoomPanEnabled((prev) => !prev);
  const handlePreviewZoomPanToggle = () =>
    setPreviewZoomPanEnabled((prev) => !prev);

  return {
    zoomPanEnabled,
    previewZoomPanEnabled,
    handleZoomPanToggle,
    handlePreviewZoomPanToggle,
  };
};
