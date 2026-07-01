import { Stethoscope, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3 text-white shadow">
            <Stethoscope size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              AI Skin Disease Diagnosis Assistant
            </h1>

            <p className="text-sm text-slate-500">
              Upload a dermoscopic image for AI-powered skin lesion analysis
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border bg-green-50 px-4 py-2 text-sm text-green-700 md:flex">
          <ShieldCheck size={18} />
          Clinical AI Demo
        </div>
      </div>
    </header>
  );
}