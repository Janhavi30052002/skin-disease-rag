import { useEffect, useMemo, useState } from "react";

export default function ConfidenceGauge({ value = 0 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    let start = 0;

    const animate = () => {
      start += (value - start) * 0.08;

      if (Math.abs(start - value) < 0.3) {
        setProgress(value);
        return;
      }

      setProgress(start);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 90;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const dashOffset =
    circumference -
    (progress / 100) * circumference;

  const gauge = useMemo(() => {
    if (progress >= 85)
      return {
        color: "#22c55e",
        label: "Excellent",
      };

    if (progress >= 70)
      return {
        color: "#3b82f6",
        label: "High",
      };

    if (progress >= 50)
      return {
        color: "#f59e0b",
        label: "Moderate",
      };

    return {
      color: "#ef4444",
      label: "Low",
    };
  }, [progress]);

  return (
    <div className="flex flex-col items-center">

      <div className="relative h-[220px] w-[220px]">

        <svg
          className="-rotate-90"
          width="220"
          height="220"
        >

          {/* Background */}

          <circle
            cx="110"
            cy="110"
            r={normalizedRadius}
            fill="none"
            stroke="rgb(226 232 240)"
            strokeWidth={stroke}
          />

          {/* Progress */}

          <circle
            cx="110"
            cy="110"
            r={normalizedRadius}
            fill="none"
            stroke={gauge.color}
            strokeWidth={stroke}
            strokeLinecap={progress >= 99.5 ? "butt" : "round"}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition:
                "stroke-dashoffset .8s ease, stroke .5s ease",
            }}
          />

        </svg>

        {/* Center */}

        <div
          className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
          "
        >

          <span
            className="
            text-5xl
            font-extrabold
            text-slate-900
            dark:text-white
            "
          >
            {Math.round(progress)}%
          </span>

          <span
            className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
            "
          >
            Confidence
          </span>

          <span
            className="mt-4 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1 text-sm font-semibold"
            style={{
              color: gauge.color,
            }}
          >
            {gauge.label}
          </span>

        </div>

      </div>

      {/* Bottom Progress */}

      <div className="mt-8 w-full max-w-sm">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-500">
            AI Confidence
          </span>

          <span
            className="font-semibold"
            style={{ color: gauge.color }}
          >
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: gauge.color,
            }}
          />

        </div>

      </div>

    </div>
  );
}