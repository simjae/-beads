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
      <div className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6">
        <div>
          <DropZone />
          <PixelSizeControl />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
            onClick={() => setIsSaved(true)}
          >
            저장
          </button>
        </div>
        <CanvasView />
      </div>
      {isSaved && <SavePreview />}
    </>
  );
};

export default CanvasContainer;
