import React from "react";
import BizCanvas from "./BeadsCanvas";
import BizPreview from "./BeadsPreview";

const BizContainer: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <h2>Biz Canvas</h2>
        <BizCanvas />
      </div>
      <div style={{ flex: 1 }}>
        <h2>Biz Preview</h2>
        <BizPreview />
      </div>
    </div>
  );
};

export default BizContainer;
