import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/Shadcn/select";
import { Label } from "@components/Shadcn/label";

const themes = ["theme-dark", "theme-light", "theme-neutral", "theme-beige"];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("theme-light");

  useEffect(() => {
    // 기존 테마를 모두 제거하고 새로운 테마를 추가합니다.
    themes.forEach((theme) => {
      document.documentElement.classList.remove(theme);
    });
    document.documentElement.classList.add(currentTheme);
    console.log("currentTheme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  return (
    <div className="flex items-center space-x-4">
      <Label htmlFor="theme-select">Choose Theme:</Label>
      <Select value={currentTheme} onValueChange={handleThemeChange}>
        <SelectTrigger id="theme-select" className="w-[180px]">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme.replace("theme-", "").toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
