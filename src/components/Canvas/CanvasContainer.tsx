"use client";
import React, { useState } from "react";
import DropZone from "../DropZone/DropZone";
import PixelSizeControl from "../PixelSizeControl/PixelSizeControl";
import CanvasView from "./CanvasView";
import SavePreview from "../SavePreview/SavePreview";

const CanvasContainer: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <>
      <div className="flex gap-6 p-6">
        <CanvasView />
      </div>
    </>
  );
};

export default CanvasContainer;
