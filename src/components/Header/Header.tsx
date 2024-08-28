import React from "react";
import Link from "next/link";
import { Button } from "@components/Shadcn/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@components/Shadcn/dropdown-menu";
import { Icon } from "../Icon/Icon";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { BeakerIcon } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40  w-full   border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between h-[50px]">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Icon type="beaker" className="h-6 w-6" />
          <span className="text-lg font-semibold">Bead Designer</span>
        </Link>
        <nav className="hidden md:flex items-center gap-20">
          <Link
            href="playground"
            className="text-sm font-medium hover:text-primary hover:underline underline-offset-4"
            prefetch={false}
          >
            Designs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Icon type="menu" className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <img
                src="/placeholder.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="rounded-full"
                style={{ aspectRatio: "36/36", objectFit: "cover" }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
