/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * Main screen for the AI Skin Disease Diagnosis application.
 *
 * Wires together:
 *   - UploadArea            (image upload + "Analyze" trigger)
 *   - DiagnosisCard          (headline prediction + risk badge)
 *   - ConfidenceGauge        (animated confidence ring)
 *   - ClinicalExplanation    (AI-generated clinical write-up)
 *   - SimilarCasesTable      (retrieval-augmented similar cases)
 *   - StatCard               (summary stat tiles)
 *   - Header / Footer
 *   - src/services/api.js    (axios instance)
 *   - generateReport.js      (client-side PDF export via jsPDF/html2canvas)
 *
 * ASSUMPTIONS (adjust to match your actual backend / folder structure):
 *   1. Import paths follow the "@/..." alias already used by your other
 *      components (@/components/ui/button, @/utils/cn, @/utils/diseaseMap).
 *      Child components are assumed to live in "@/components/*", the axios
 *      instance in "@/services/api", and the PDF helper in
 *      "@/utils/generateReport". Update the import block below if your
 *      real paths differ.
 *   2. Backend endpoint is POST /predict, sent as multipart/form-data with
 *      the file under the field name "file". Expected JSON response:
 *        {
 *          diagnosis: string,
 *          confidence: number,          // 0-100 or 0-1 (both handled)
 *          risk: "High" | "Medium" | "Low" | "Unknown",
 *          explanation: { [sectionTitle: string]: string },
 *          similar_cases: [{ diagnosis, score, age, sex, localization }]
 *        }
 *      If your API differs, only handleAnalyze() needs to change.
 *   3. Dark mode is toggled elsewhere (Header already renders a
 *      ThemeToggle), so Dashboard only applies dark: Tailwind classes and
 *      does not own theme state itself.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Download,
  FileWarning,
  ImageIcon,
  ListChecks,
  Loader2,
  Percent,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadArea from "@/components/UploadArea";
import DiagnosisCard from "@/components/DiagnosisCard";
import ConfidenceGauge from "@/components/ConfidenceGauge";
import ClinicalExplanation from "@/components/ClinicalExplanation";
import SimilarCasesTable from "@/components/SimilarCasesTable";
import StatCard from "@/components/StatCard";

import api from "@/services/api";
import { generatePDF } from "@/utils/generateReport";

// DiagnosisCard only recognizes the exact keys "High" | "Medium" | "Low"
// (case-sensitive) and falls back to "Unknown" for anything else. Backends
// commonly send lowercase strings, numeric scores, or a differently-named
// field, so normalize here instead of passing the raw value straight
// through. Extend the synonym lists if your API uses other wording.
function normalizeRisk(raw) {
  if (raw === null || raw === undefined || raw === "") return "Unknown";

  const value = String(raw).trim().toLowerCase();

  if (["high", "high risk", "severe", "malignant", "3"].includes(value)) {
    return "High";
  }
  if (["medium", "moderate", "mid", "intermediate", "2"].includes(value)) {
    return "Medium";
  }
  if (["low", "low risk", "benign", "mild", "1"].includes(value)) {
    return "Low";
  }

  return "Unknown";
}

export default function Dashboard() {
  // ── Upload state ──────────────────────────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState(null);

  // ── Analysis state ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  // result shape: { diagnosis, confidence, risk, explanation, similarCases }

  // ── PDF export state ──────────────────────────────────────────────────
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // ── Refs used by generateReport.js to capture DOM nodes into the PDF ──
  const imageRef = useRef(null);
  const explanationRef = useRef(null);
  const gaugeRef = useRef(null);

  // Object URL for the uploaded file, used for the report's image capture
  const imageUrl = useMemo(() => {
    if (!uploadedFile) return null;
    return URL.createObjectURL(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleAnalyze = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // TEMPORARY DEBUG LOG — remove once risk mapping is confirmed working.
      // Check your browser console after clicking Analyze and compare the
      // printed shape against what normalizeRisk() and the mapping below
      // expect.
      console.log("Raw /predict response:", data);

      const rawConfidence = Number(data?.confidence ?? 0);
      const normalizedConfidence =
        rawConfidence <= 1 ? Math.round(rawConfidence * 100) : Math.round(rawConfidence);

      const rawRisk =
        data?.risk ?? data?.risk_level ?? data?.riskLevel ?? data?.result?.risk;

      setResult({
        diagnosis: data?.diagnosis ?? "Unknown",
        confidence: Number.isFinite(normalizedConfidence) ? normalizedConfidence : 0,
        risk: normalizeRisk(rawRisk),
        explanation: data?.explanation ?? {},
        similarCases: data?.similar_cases ?? data?.similarCases ?? [],
      });
    } catch (err) {
      setResult(null);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Something went wrong while analyzing the image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setResult(null);
    setError(null);
    setPdfError(null);
  };

  const handleDownloadReport = async () => {
    if (!result) return;

    setPdfLoading(true);
    setPdfError(null);

    try {
      await generatePDF({
        diagnosis: result.diagnosis,
        confidence: result.confidence,
        risk: result.risk,
        explanationRef,
        imageRef,
        gaugeRef,
        similarCases: result.similarCases,
      });
    } catch (err) {
      setPdfError(err?.message || "Failed to generate the PDF report.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* Global error banner */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Analysis failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Upload + Diagnosis */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <UploadArea
            onAnalyze={handleAnalyze}
            loading={loading}
            setUploadedImage={setUploadedFile}
          />

          <DiagnosisCard
            diagnosis={result?.diagnosis}
            confidence={result?.confidence ?? 0}
            risk={result?.risk}
          />
        </div>

        {/* Stat tiles — only meaningful once a result exists */}
        {result && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            <StatCard
              icon={<ShieldAlert size={22} />}
              title="Diagnosis"
              value={result.diagnosis}
              color="blue"
            />
            <StatCard
              icon={<Percent size={22} />}
              title="Confidence"
              value={`${result.confidence}%`}
              color="green"
            />
            <StatCard
              icon={<Activity size={22} />}
              title="Risk Level"
              value={result.risk}
              color="red"
            />
            <StatCard
              icon={<ListChecks size={22} />}
              title="Similar Cases"
              value={result.similarCases.length}
              color="purple"
            />
          </div>
        )}

        {/* Confidence gauge + captured image (feeds the PDF report) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div
            ref={gaugeRef}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              Confidence Score
            </h2>
            <ConfidenceGauge value={result?.confidence ?? 0} />
          </div>

          <div
            ref={imageRef}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              Analyzed Image
            </h2>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Analyzed dermoscopic lesion"
                className="mx-auto h-72 w-full rounded-2xl border border-slate-200 object-contain bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              />
            ) : (
              <div className="flex h-72 flex-col items-center justify-center text-center text-slate-400">
                <ImageIcon size={56} className="mb-4" />
                <p>No image uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Clinical explanation */}
        <div ref={explanationRef}>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Clinical Explanation
          </h2>
          <ClinicalExplanation data={result?.explanation ?? {}} />
        </div>

        {/* Similar cases */}
        <SimilarCasesTable similarCases={result?.similarCases ?? []} />

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 border-t border-slate-200 pt-8 dark:border-slate-800 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!uploadedFile && !result}
          >
            Start Over
          </Button>

          <div className="flex flex-col items-end gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleDownloadReport}
              disabled={!result || pdfLoading}
            >
              {pdfLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Report
                </>
              )}
            </Button>

            {pdfError && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <FileWarning size={14} />
                {pdfError}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}