import { useState, useRef } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadArea from "@/components/UploadArea";
import DiagnosisCard from "@/components/DiagnosisCard";
import ClinicalExplanation from "@/components/ClinicalExplanation";
import ConfidenceGauge from "@/components/ConfidenceGauge";

import api from "@/services/api";
import { diseaseMap, getRisk } from "@/utils/diseaseMap";
import { parseKnowledge } from "@/utils/parseKnowledge";
import { generatePDF } from "@/utils/generateReport";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [prediction, setPrediction] = useState(null);
  const [knowledge, setKnowledge] = useState("");
  const [similarCases, setSimilarCases] = useState([]);

  // 📌 Refs for PDF capture
  const uploadRef = useRef(null);
  const explanationRef = useRef(null);
  const gaugeRef = useRef(null);

  const handleAnalyze = async (file) => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/explain", formData);

      const {
        prediction: rawPrediction,
        confidence,
        knowledge,
        similar_cases,
      } = response.data;

      setPrediction({
        diagnosis: diseaseMap?.[rawPrediction] ?? rawPrediction,
        confidence: Math.round((confidence ?? 0) * 100),
        risk: getRisk(rawPrediction),
      });

      setKnowledge(knowledge || "");
      setSimilarCases(Array.isArray(similar_cases) ? similar_cases : []);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    await generatePDF({
      diagnosis: prediction?.diagnosis,
      confidence: prediction?.confidence,
      risk: prediction?.risk,
      explanationRef,
      imageRef: uploadRef,
      similarCases,
      gaugeRef,
    });
  };

  const parsedKnowledge = parseKnowledge(knowledge);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 md:px-8 py-8 space-y-10">

        {/* ACTION BAR */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadPDF}
            disabled={!prediction}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            📄 Download Report
          </button>
        </div>

        {/* UPLOAD + DIAGNOSIS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Upload (PDF capture wrapper) */}
          <div ref={uploadRef}>
            <UploadArea onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {/* Diagnosis */}
          <DiagnosisCard
            diagnosis={prediction?.diagnosis}
            confidence={prediction?.confidence}
            risk={prediction?.risk}
          />

        </section>

        {/* CONFIDENCE GAUGE (for PDF capture) */}
        {prediction && (
          <div className="flex justify-center" ref={gaugeRef}>
            <ConfidenceGauge value={prediction.confidence || 0} />
          </div>
        )}

        {/* CLINICAL EXPLANATION */}
        <section
          ref={explanationRef}
          className="rounded-2xl bg-white p-6 md:p-8 shadow-lg"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Clinical Explanation
              </h2>
              <p className="text-slate-500">
                Structured AI medical interpretation
              </p>
            </div>
          </div>

          <ClinicalExplanation data={parsedKnowledge} />
        </section>

        {/* SIMILAR CASES */}
        <section className="rounded-2xl bg-white p-6 md:p-8 shadow-lg">

          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🔍</span>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Similar Cases
              </h2>
              <p className="text-slate-500">
                Top visually similar ISIC cases
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-sm">

              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left">Diagnosis</th>
                  <th className="px-5 py-3 text-center">Similarity</th>
                  <th className="px-5 py-3 text-center">Age</th>
                  <th className="px-5 py-3 text-center">Sex</th>
                  <th className="px-5 py-3 text-center">Location</th>
                </tr>
              </thead>

              <tbody>
                {similarCases.length > 0 ? (
                  similarCases.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-slate-50">

                      <td className="px-5 py-4">
                        {diseaseMap?.[item.diagnosis] ?? item.diagnosis}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {((item.score ?? 0) * 100).toFixed(1)}%
                      </td>

                      <td className="px-5 py-4 text-center">
                        {item.age ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-center capitalize">
                        {item.sex ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-center capitalize">
                        {item.localization ?? "—"}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-500"
                    >
                      No similar cases available.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}