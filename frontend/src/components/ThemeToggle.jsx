import { MoonStar, SunMedium } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-xl
      border
      border-slate-300
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      shadow-sm
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-md
      "
    >
      {theme === "dark" ? (
        <SunMedium size={20} />
      ) : (
        <MoonStar size={20} />
      )}
    </button>
  );
}