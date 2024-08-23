// components/ThemeSwitcher.tsx
import React, { useEffect, useState } from "react";

const themes = ["theme-dark", "theme-light", "theme-neutral"];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("theme-dark");

  useEffect(() => {
    document.documentElement.classList.add(currentTheme);
    return () => {
      document.documentElement.classList.remove(currentTheme);
    };
  }, [currentTheme]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(event.target.value);
  };

  return (
    <div>
      <label htmlFor="theme-select" className="mr-2">
        Choose Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={handleThemeChange}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.replace("theme-", "").toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
