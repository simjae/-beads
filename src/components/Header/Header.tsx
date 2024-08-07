"use client";
import React, { FC } from "react";
import Link from "next/link";
import { Icon } from "@components/Icon";
import { Button } from "@components/Button";

interface HeaderProps {
  onFileUpload: (file: File) => void;
}

export const Header: FC<HeaderProps> = ({ onFileUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <header className="bg-background border-b shadow-sm px-4 py-3 flex items-center justify-between">
      <Link
        href="#"
        className="flex items-center gap-2 font-semibold"
        prefetch={false}
      >
        <Icon type="image" className="w-6 h-6" />
        Image Layout Tool
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Icon type="upload" className="w-4 h-4 mr-2" />
          <label htmlFor="file-upload" className="cursor-pointer">
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </Button>
        <Button>
          <Icon type="save" className="w-4 h-4 mr-2" />
          Save Layout
        </Button>
      </div>
    </header>
  );
};
