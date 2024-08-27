"use client";
import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isRootPath = pathname === "/";
  return (
    <div className="flex w-full flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex w-full h-screen">
        {!isRootPath && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <div className="flex flex-col flex-grow">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
