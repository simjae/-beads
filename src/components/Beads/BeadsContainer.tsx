"use client";
import React, { useState } from "react";
import BeadsCanvas from "./BeadsCanvas";
import BeadsPreview from "./BeadsPreview";
import { usePreviewStore } from "@src/stores/useCanvasStore";
import SimplifiedBeadsPreview from "./SimplifiedBeadsPreview";
import { TooltipProvider } from "@components/Shadcn/tooltip";

const BeadsContainer: React.FC = () => {
  const { beadPattern } = usePreviewStore();

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <div style={{ flex: 1 }}>
          <h2>Beads Canvas</h2>
          <BeadsCanvas />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Beads Preview</h2>
          <BeadsPreview />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Simplified Beads Pattern</h2>
          {beadPattern.length > 0 ? (
            <SimplifiedBeadsPreview />
          ) : (
            <p>No pattern to display</p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BeadsContainer;
