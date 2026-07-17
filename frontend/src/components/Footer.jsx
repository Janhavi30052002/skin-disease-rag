export default function Footer() {
  return (
    <footer
      className="
      mt-12
      border-t
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              AI Skin Disease Diagnosis Assistant
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Educational and research use only. Not a substitute for clinical diagnosis.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} AI Dermatology Assistant
          </p>
        </div>
      </div>
    </footer>
  );
}