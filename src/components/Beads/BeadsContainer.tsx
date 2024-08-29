"use client";

import React, { useState } from "react";
import BeadsCanvas from "./BeadsCanvas";
import BeadsPreview from "./BeadsPreview";

const BeadsContainer: React.FC = () => {
  const [zoomPanEnabled, setZoomPanEnabled] = useState(true);
  const [previewZoomPanEnabled, setPreviewZoomPanEnabled] = useState(true);
  const [previewMode, setPreviewMode] = useState("pixelated");

  const handleZoomPanToggle = (enabled: boolean) => {
    setZoomPanEnabled(enabled);
  };

  const handlePreviewZoomPanToggle = (enabled: boolean) => {
    setPreviewZoomPanEnabled(enabled);
  };

  const handlePreviewModeChange = (mode: string) => {
    setPreviewMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <BeadsCanvas zoomPanEnabled={zoomPanEnabled} />
      </div>
      <div className="flex-1">
        <BeadsPreview
          zoomPanEnabled={previewZoomPanEnabled}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
};

export default BeadsContainer;
