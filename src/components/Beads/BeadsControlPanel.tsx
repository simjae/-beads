"use client";
import React from "react";
import { Button } from "@components/Shadcn/button";
import { Input } from "@components/Shadcn/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/Shadcn/select";
import { useBeadsControl } from "@src/hooks/useBeadsControl";

const BeadsControlPanel: React.FC = () => {
  const {
    zoomPanEnabled,
    previewZoomPanEnabled,
    selectedPixelCount,
    previewMode,
    fileInputRef,
    handleZoomPanToggle,
    handlePreviewZoomPanToggle,
    handleFileUpload,
    handleSaveCanvas,
    handlePixelate,
    handleClear,
    handlePixelCountChange,
    handlePreviewModeChange,
  } = useBeadsControl();

  return (
    <div className="p-4 space-y-2">
      {/* 파일 업로드 */}
      <div>
        <Button onClick={() => fileInputRef.current?.click()}>
          Upload Image
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* 픽셀 칸 선택 */}
      <div>
        <Select
          value={selectedPixelCount.toString()}
          onValueChange={(value) => handlePixelCountChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select pixel count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100 칸</SelectItem>
            <SelectItem value="500">500 칸</SelectItem>
            <SelectItem value="1000">1000 칸</SelectItem>
            <SelectItem value="2000">2000 칸</SelectItem>
            <SelectItem value="5000">5000 칸</SelectItem>
            <SelectItem value="10000">10000 칸</SelectItem>
            <SelectItem value="20000">20000 칸</SelectItem>
            <SelectItem value="50000">50000 칸</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 캔버스 저장 */}
      <Button onClick={handleSaveCanvas}>Save Canvas</Button>

      {/* 픽셀화 및 클리어 버튼 */}
      <Button onClick={handlePixelate}>Pixelate Image</Button>
      <Button onClick={handleClear} variant="outline">
        Clear
      </Button>

      {/* 줌/팬 활성화 토글 */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={zoomPanEnabled}
            onChange={handleZoomPanToggle}
          />
          Enable Zoom/Pan on Canvas
        </label>
      </div>

      {/* 프리뷰 줌/팬 활성화 토글 */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={previewZoomPanEnabled}
            onChange={handlePreviewZoomPanToggle}
          />
          Enable Zoom/Pan on Preview
        </label>
      </div>

      {/* 프리뷰 모드 선택 */}
      <div>
        <h3>Preview Mode</h3>
        <label>
          <input
            type="radio"
            name="previewMode"
            value="original"
            checked={previewMode === "original"}
            onChange={() => handlePreviewModeChange("original")}
          />
          Original Image
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="previewMode"
            value="pixelated"
            checked={previewMode === "pixelated"}
            onChange={() => handlePreviewModeChange("pixelated")}
          />
          Pixelated
        </label>
        <label className="ml-4">
          <input
            type="radio"
            name="previewMode"
            value="beadPattern"
            checked={previewMode === "beadPattern"}
            onChange={() => handlePreviewModeChange("beadPattern")}
          />
          Bead Pattern
        </label>
      </div>
    </div>
  );
};

export default BeadsControlPanel;
