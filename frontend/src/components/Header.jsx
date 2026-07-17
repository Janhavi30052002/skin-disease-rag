import { ShieldCheck, Stethoscope } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
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

      backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3 text-white shadow-lg">
            <Stethoscope size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Skin Disease Diagnosis
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI-powered dermatology assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="
            hidden
            items-center
            gap-2
            rounded-full
            border
            border-green-200
            bg-green-50
            px-4
            py-2
            text-sm
            text-green-700
            dark:border-green-800
            dark:bg-green-900/20
            dark:text-green-300
            md:flex
            "
          >
            <ShieldCheck size={16} />
            Clinical AI Demo
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}