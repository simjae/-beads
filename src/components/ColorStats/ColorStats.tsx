import React from "react";
import { useCanvasStore } from "@src/stores/useCanvasStore";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@components/Shadcn/tooltip";

const ColorStats: React.FC = () => {
  const { colorStats } = useCanvasStore();

  const colorEntries = Object.entries(colorStats);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Color Palette</h3>
      <div className="flex flex-wrap gap-2">
        {colorEntries.map(([color, count]) => (
          <Tooltip key={color}>
            <TooltipTrigger
              className="w-8 h-8 rounded-xl"
              style={{ backgroundColor: color }}
            />
            <TooltipContent>
              <span>{count} pixels</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ColorStats;
