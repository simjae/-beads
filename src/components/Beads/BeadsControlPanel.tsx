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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/Shadcn/card";
import { Switch } from "@components/Shadcn/switch";
import { Label } from "@components/Shadcn/label";
import { RadioGroup, RadioGroupItem } from "@src/components/Shadcn/radio-group"; // Adjust the path as needed
import { useBeadsControl } from "@src/hooks/beads/useBeadsControl";

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
    handlePixelate,
    handleClear,
    handlePixelCountChange,
    handlePreviewModeChange,
  } = useBeadsControl();

  return (
    <Card className="p-6 space-y-6 shadow-md rounded-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Beads Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 이미지 업로드 */}
        <div className="flex items-center space-x-2">
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

        {/* 픽셀 카운트 선택 */}
        <div>
          <Label>Select Pixel Count</Label>
          <Select
            value={selectedPixelCount.toString()}
            onValueChange={(value) =>
              handlePixelCountChange(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select pixel count" />
            </SelectTrigger>
            <SelectContent>
              {[
                "100",
                "500",
                "1000",
                "2000",
                "5000",
                "10000",
                "20000",
                "50000",
              ].map((count) => (
                <SelectItem
                  key={count}
                  value={count}
                >{`${count} 칸`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 캔버스 저장, 픽셀화 및 클리어 버튼 */}
        <div className="flex flex-wrap gap-2">
          {/* <Button onClick={handleSaveCanvas}>Save Canvas</Button> */}
          <Button onClick={handlePixelate}>Pixelate Image</Button>
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>

        {/* 캔버스 줌/팬 설정 */}
        <div className="flex items-center space-x-4">
          <Switch checked={zoomPanEnabled} onChange={handleZoomPanToggle} />
          <Label>Enable Zoom/Pan on Canvas</Label>
        </div>

        {/* 프리뷰 줌/팬 설정 */}
        <div className="flex items-center space-x-4">
          <Switch
            checked={previewZoomPanEnabled}
            onChange={handlePreviewZoomPanToggle}
          />
          <Label>Enable Zoom/Pan on Preview</Label>
        </div>

        {/* 프리뷰 모드 선택 */}
        <div>
          <h3 className="text-lg font-medium">Preview Mode</h3>
          <RadioGroup
            value={previewMode}
            onValueChange={handlePreviewModeChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="original" id="original" />
              <Label htmlFor="original">Original Image</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pixelated" id="pixelated" />
              <Label htmlFor="pixelated">Pixelated</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beadPattern" id="beadPattern" />
              <Label htmlFor="beadPattern">Bead Pattern</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeadsControlPanel;
