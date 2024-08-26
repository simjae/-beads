import React from "react";
import Link from "next/link";
import { Input } from "@components/Shadcn/input";
import { Slider } from "@components/Shadcn/slider";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@components/Shadcn/collapsible";
import { Button } from "../Shadcn/button";
import { Icon } from "../Icon/Icon";
import { useCanvasStore } from "@src/stores/useCanvasStore";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const {
    canvasWidth,
    canvasHeight,
    gridSize,
    gridColor,
    imageOpacity,
    updateCanvasSize,
    updateGridSize,
    updateGridColor,
    updateImageOpacity,
  } = useCanvasStore();

  return (
    <aside
      className={` h-screen fixed inset-y-0  left-0 z-30 w-64 bg-background p-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:flex md:flex-col md:transform-none md:border-r`}
    >
      <div className="flex justify-between items-center md:hidden">
        <h3 className="text-lg font-semibold">Menu</h3>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Icon type="menu" className="h-5 w-5" />
          <span className="sr-only">Close Menu</span>
        </Button>
      </div>

      {/* Canvas Controls Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">Canvas Controls</h3>
        <div className="space-y-4">
          <div>
            <label>Canvas Width: </label>
            <Input
              type="number"
              value={canvasWidth}
              onChange={(e) =>
                updateCanvasSize(Number(e.target.value), canvasHeight)
              }
            />
          </div>
          <div>
            <label>Canvas Height: </label>
            <Input
              type="number"
              value={canvasHeight}
              onChange={(e) =>
                updateCanvasSize(canvasWidth, Number(e.target.value))
              }
            />
          </div>
          <div>
            <label>Grid Size: </label>
            <Input
              type="number"
              value={gridSize}
              onChange={(e) => updateGridSize(Number(e.target.value))}
            />
          </div>
          {/* <div>
            <label>Image Opacity: </label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={imageOpacity}
              onValueChange={(value) => updateImageOpacity(value)}
            />
          </div> */}
        </div>
      </div>

      {/* Additional Sidebar Sections */}
      {/* <ColorPalette />
      <BeadTypes />
      <MyDesigns /> */}
    </aside>
  );
};

const ColorPalette: React.FC = () => {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
  ];

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold">Color Palette</h3>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

const BeadTypes: React.FC = () => {
  const beadTypes = [
    {
      label: "Seed Beads",
      items: ["Round Seed Beads", "Delica Beads", "Peanut Beads"],
    },
    {
      label: "Bugle Beads",
      items: ["Long Bugle Beads", "Short Bugle Beads"],
    },
    {
      label: "Shaped Beads",
      items: ["Cube Beads", "Pyramid Beads", "Flower Beads"],
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold">Bead Types</h3>
      {beadTypes.map((type, index) => (
        <Collapsible key={index} className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between text-sm font-medium">
            {type.label}
            <Icon type="chevronDown" className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {type.items.map((item, idx) => (
              <Link
                key={idx}
                href="#"
                className="text-sm hover:text-primary"
                prefetch={false}
              >
                {item}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

const MyDesigns: React.FC = () => {
  const designs = [
    { title: "Floral Bracelet", src: "/placeholder.svg" },
    { title: "Geometric Necklace", src: "/placeholder.svg" },
    { title: "Beaded Earrings", src: "/placeholder.svg" },
  ];

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">My Designs</h3>
      <Collapsible className="space-y-2">
        <CollapsibleTrigger className="flex items-center justify-between text-sm font-medium">
          Recent Designs
          <Icon type="chevronDown" className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {designs.map((design, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center gap-2 text-sm hover:text-primary"
              prefetch={false}
            >
              <img
                src={design.src}
                width={40}
                height={40}
                alt="Design Thumbnail"
                className="rounded"
                style={{ aspectRatio: "40/40", objectFit: "cover" }}
              />
              {design.title}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Sidebar;
