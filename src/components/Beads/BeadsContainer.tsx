"use client";

import React from "react";
import BeadsCanvas from "./BeadsCanvas";
import BeadsPreview from "./BeadsPreview";

const BeadsContainer: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex-1">
        <BeadsCanvas />
      </div>
      <div className="flex-1">
        <BeadsPreview />
      </div>
    </div>
  );
};

export default BeadsContainer;
