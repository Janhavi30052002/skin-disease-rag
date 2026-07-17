import { cn } from "@/utils/cn";

export default function StatCard({
  icon,
  title,
  value,
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      shadow-lg
      p-6
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>

        </div>

        <div
          className={cn(
            "rounded-xl p-3",
            colors[color]
          )}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}