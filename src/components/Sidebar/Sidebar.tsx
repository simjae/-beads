"use client";

import React from "react";
import BeadsControlPanel from "../Beads/BeadsControlPanel";
import { Button } from "../Shadcn/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`h-screen fixed inset-y-0 left-0 z-30 w-64 bg-background p-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:flex md:flex-col md:transform-none md:border-r`}
    >
      <div className="flex justify-between items-center md:hidden">
        <h3 className="text-lg font-semibold">Menu</h3>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <span className="sr-only">Close Menu</span>
        </Button>
      </div>

      <BeadsControlPanel />
    </aside>
  );
};

export default Sidebar;
