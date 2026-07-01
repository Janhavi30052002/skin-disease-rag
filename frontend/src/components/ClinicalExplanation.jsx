export default function ClinicalExplanation({ data }) {
  if (!data) {
    return (
      <p className="text-center text-slate-500">
        Upload an image to generate clinical explanation.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {/* Overview */}
      <div className="p-4 rounded-xl bg-slate-50 border">
        <h3 className="font-semibold text-slate-800 mb-2">Overview</h3>
        <p className="text-slate-600">{data.overview || "N/A"}</p>
      </div>

      {/* Features */}
      <div className="p-4 rounded-xl bg-slate-50 border">
        <h3 className="font-semibold text-slate-800 mb-2">
          Clinical Features
        </h3>

        {data.features?.length > 0 ? (
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            {data.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No features available</p>
        )}
      </div>

      {/* ABCDE Rule */}
      <div className="p-4 rounded-xl bg-slate-50 border">
        <h3 className="font-semibold text-slate-800 mb-2">
          ABCDE Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
          <p><b>A:</b> {data.abcde?.a || "N/A"}</p>
          <p><b>B:</b> {data.abcde?.b || "N/A"}</p>
          <p><b>C:</b> {data.abcde?.c || "N/A"}</p>
          <p><b>D:</b> {data.abcde?.d || "N/A"}</p>
          <p><b>E:</b> {data.abcde?.e || "N/A"}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-slate-50 border">
        <h3 className="font-semibold text-slate-800 mb-2">
          Recommendation
        </h3>
        <p className="text-slate-600">
          {data.recommendation || "No recommendation available"}
        </p>
      </div>

    </div>
  );
}