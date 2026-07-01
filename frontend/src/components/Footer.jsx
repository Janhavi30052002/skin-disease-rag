export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI Skin Disease Diagnosis Assistant •
          Built with React, Tailwind CSS, FastAPI & AI
        </p>
      </div>
    </footer>
  );
}