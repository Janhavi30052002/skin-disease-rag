import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Brain,
  Activity,
} from "lucide-react";

export default function DiagnosisCard({
  diagnosis,
  confidence,
  risk,
}) {
  const riskConfig = {
    High: {
      icon: <ShieldAlert size={22} />,
      badge:
        "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
      recommendation:
        "Immediate consultation with a dermatologist is recommended.",
    },

    Medium: {
      icon: <Activity size={22} />,
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
      recommendation:
        "Clinical evaluation is recommended for confirmation.",
    },

    Low: {
      icon: <ShieldCheck size={22} />,
      badge:
        "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
      recommendation:
        "Routine monitoring is generally sufficient.",
    },

    Unknown: {
      icon: <ShieldQuestion size={22} />,
      badge:
        "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      recommendation:
        "Unable to determine clinical recommendation.",
    },
  };

  const current = riskConfig[risk] || riskConfig.Unknown;

  return (
    <div
      className="
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      shadow-lg
      p-8
      flex
      flex-col
      "
    >
      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">
          <Brain className="text-blue-600 dark:text-blue-300" />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Diagnosis
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            Vision Transformer Prediction
          </p>

        </div>

      </div>

      {!diagnosis ? (
        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <Brain
              size={70}
              className="mx-auto mb-6 text-slate-300"
            />

            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Waiting for Analysis
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Upload a dermoscopic image to generate an AI diagnosis.
            </p>

          </div>

        </div>
      ) : (
        <div className="mt-8 space-y-8">

          {/* Diagnosis */}

          <div className="text-center">

            <p className="text-sm uppercase tracking-wider text-slate-500">
              Predicted Disease
            </p>

            <h3 className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
              {diagnosis}
            </h3>

          </div>

          {/* Risk */}

          <div className="flex justify-center">

            <div
              className={`
                flex items-center gap-2
                px-5 py-3
                rounded-full
                border
                font-semibold
                ${current.badge}
              `}
            >
              {current.icon}

              {risk || "Unknown"} Risk

            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-5">

            <div
              className="
              rounded-2xl
              bg-slate-50
              dark:bg-slate-800
              p-5
              text-center
              "
            >
              <p className="text-sm text-slate-500">
                Confidence
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {confidence}%
              </h3>

            </div>

            <div
              className="
              rounded-2xl
              bg-slate-50
              dark:bg-slate-800
              p-5
              text-center
              "
            >
              <p className="text-sm text-slate-500">
                AI Certainty
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {confidence > 80
                  ? "High"
                  : confidence > 60
                  ? "Moderate"
                  : "Low"}
              </h3>

            </div>

          </div>

          {/* Recommendation */}

          <div
            className="
            rounded-2xl
            bg-blue-50
            dark:bg-blue-900/20
            border
            border-blue-200
            dark:border-blue-800
            p-5
            "
          >
            <h4 className="font-semibold text-blue-700 dark:text-blue-300">
              Clinical Recommendation
            </h4>

            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {current.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}