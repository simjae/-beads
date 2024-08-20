"use client";
import { useImageStore } from "@src/stors/useImageStore";
import React from "react";
import { useDropzone } from "react-dropzone";

const DropZone: React.FC = () => {
  const { addImage } = useImageStore();

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const imgSrc = event.target.result as string;
          const img = new window.Image();
          img.src = imgSrc;
          img.onload = () => {
            addImage({ src: imgSrc, x: 0, y: 0, width: 100, height: 100 });
          };
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className: "dropzone bg-muted rounded-lg p-4 flex flex-col gap-4",
      })}
    >
      <h3 className="font-semibold">Image Preview</h3>
      <div className="aspect-square bg-muted-foreground/10 rounded-md flex items-center justify-center"></div>
      <input {...getInputProps()} />
      <p className="text-muted-foreground text-sm">
        Drag and drop your image onto the canvas to position it.
      </p>
    </div>
  );
};

export default DropZone;
