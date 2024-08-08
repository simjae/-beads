"use client";
import React, { FC } from "react";
import { Icon } from "../Icon";

export const ImagePreview: FC = () => {
  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-semibold">Image Preview</h3>
      <div className="aspect-square bg-muted-foreground/10 rounded-md flex items-center justify-center">
        <Icon type="image" className="w-12 h-12 text-muted-foreground/50" />
      </div>
      <p className="text-muted-foreground text-sm">
        Drag and drop your image onto the canvas to position it.
      </p>
    </div>
  );
};
