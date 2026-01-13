"use client";
import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className="h-9 w-9" />;
  }
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };
  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="h-4 w-4 text-orange-500" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-indigo-400" />}
      {theme === "system" && <Monitor className="h-4 w-4 text-zinc-500" />}
    </button>
  );
}