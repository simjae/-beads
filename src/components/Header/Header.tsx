// components/molecules/Header.tsx
import React, { FC } from "react";
import Link from "next/link";
import { Icon } from "../Icon";
import { Button } from "../Button";

export const Header: FC = () => {
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
          Upload Image
        </Button>
        <Button>
          <Icon type="save" className="w-4 h-4 mr-2" />
          Save Layout
        </Button>
      </div>
    </header>
  );
};
