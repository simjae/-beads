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
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <p>업로드된 이미지들이 여기에 표시됩니다. 위치와 크기를 조정하세요.</p>
    </div>
  );
};

export default DropZone;
