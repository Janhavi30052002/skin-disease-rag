import { Stethoscope, ShieldCheck, Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200
        dark:border-slate-800
        bg-white/80
        dark:bg-slate-950/80
        backdrop-blur-lg
        shadow-sm
      "
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3 text-white shadow-lg">
            <Stethoscope size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Skin Disease Diagnosis Assistant
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload a dermoscopic image for AI-powered skin lesion analysis
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              rounded-full
              border
              border-green-200
              dark:border-green-800
              bg-green-50
              dark:bg-green-900/30
              px-4
              py-2
              text-sm
              text-green-700
              dark:text-green-300
            "
          >
            <ShieldCheck size={18} />
            Clinical AI Demo
          </div>

          <button
            onClick={toggleTheme}
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
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-all
            "
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}