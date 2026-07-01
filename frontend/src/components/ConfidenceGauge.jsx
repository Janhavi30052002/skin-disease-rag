import { useEffect, useState } from "react";

export default function ConfidenceGauge({ value = 0 }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Smooth animation
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 10;
    const steps = duration / stepTime;
    const increment = value / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setAnimatedValue(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (animatedValue / 100) * circumference;

  // Color logic (medical-style risk gradient)
  const getColor = (val) => {
    if (val < 40) return "#ef4444"; // red
    if (val < 70) return "#f59e0b"; // amber
    return "#22c55e"; // green
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={180} width={180} className="transform -rotate-90">
        {/* background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={90}
          cy={90}
        />

        {/* progress circle */}
        <circle
          stroke={getColor(animatedValue)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={90}
          cy={90}
          style={{
            transition: "stroke-dashoffset 0.3s linear",
          }}
        />
      </svg>

      {/* center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800">
          {Math.round(animatedValue)}%
        </span>
        <span className="text-xs text-slate-500">Confidence</span>
      </div>
    </div>
  );
}