"use client";
import { useImageStore } from "@src/stors/useImageStore";
import React from "react";

const PixelSizeControl: React.FC = () => {
  const { tileSize, setTileSize } = useImageStore();

  return (
    <div className="pixel-size-control">
      <label htmlFor="tileSizeRange">픽셀 크기: {tileSize}</label>
      <input
        id="tileSizeRange"
        type="range"
        min="1"
        max="50"
        value={tileSize}
        onChange={(e) => setTileSize(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default PixelSizeControl;
