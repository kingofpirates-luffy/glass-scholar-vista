
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full transition-all duration-500 hover:bg-purple/20 dark:hover:bg-purple/30"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-all duration-300" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-300 text-yellow-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
