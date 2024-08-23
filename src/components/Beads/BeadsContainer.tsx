import React from "react";
import BeadsCanvas from "./BeadsCanvas";
import BeadsPreview from "./BeadsPreview";

const BeadsContainer: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <h2>Beads Canvas</h2>
        <BeadsCanvas />
      </div>
      <div style={{ flex: 1 }}>
        <h2>Beads Preview</h2>
        <BeadsPreview />
      </div>
    </div>
  );
};

export default BeadsContainer;
