import ConfidenceGauge from "./ConfidenceGauge";

export default function DiagnosisCard({ diagnosis, confidence, risk }) {
  const getRiskStyle = (risk) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg flex flex-col items-center justify-center space-y-6">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">
          AI Diagnosis
        </h2>
        <p className="text-sm text-slate-500">
          Model prediction output
        </p>
      </div>

      {/* Main Content */}
      {diagnosis ? (
        <>
          {/* Diagnosis Result */}
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              {diagnosis}
            </p>
          </div>

          {/* Confidence Gauge */}
          <div className="relative flex items-center justify-center">
            <ConfidenceGauge value={confidence || 0} />
          </div>

          {/* Risk Badge */}
          <div
            className={`px-4 py-1 rounded-full text-sm font-medium border ${getRiskStyle(
              risk
            )}`}
          >
            {risk ? `${risk} Risk` : "Risk Unknown"}
          </div>

          {/* Extra Info Row (optional but useful) */}
          <div className="grid grid-cols-2 gap-4 w-full pt-2">
            <div className="text-center p-3 rounded-lg bg-slate-50 border">
              <p className="text-xs text-slate-500">Confidence</p>
              <p className="font-semibold text-slate-700">
                {confidence ?? 0}%
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-50 border">
              <p className="text-xs text-slate-500">Status</p>
              <p className="font-semibold text-slate-700">
                {confidence > 70
                  ? "High Certainty"
                  : confidence > 40
                  ? "Moderate"
                  : "Low Certainty"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-500">
            Upload a skin image to generate AI diagnosis
          </p>
        </div>
      )}
    </div>
  );
}