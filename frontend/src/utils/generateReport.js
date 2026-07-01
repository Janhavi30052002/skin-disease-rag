import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function generateCaseId() {
  return "SKIN-" + Date.now().toString().slice(-8);
}

export async function generatePDF({
  diagnosis,
  confidence,
  risk,
  explanationRef,
  imageRef,
  similarCases = [],
  gaugeRef,
}) {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  let y = 15;
  const caseId = generateCaseId();

  // =========================
  // HEADER (Hospital Style)
  // =========================
  pdf.setFillColor(20, 20, 40);
  pdf.rect(0, 0, pageWidth, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("DERMATOLOGY AI DIAGNOSTIC REPORT", 15, 13);

  pdf.setTextColor(0, 0, 0);
  y = 30;

  // =========================
  // CASE INFO BOX
  // =========================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(`Case ID: ${caseId}`, 15, y);

  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, y);

  y += 10;

  // =========================
  // DIAGNOSIS SECTION
  // =========================
  pdf.setDrawColor(200);
  pdf.rect(10, y, 190, 30);

  pdf.setFont("helvetica", "bold");
  pdf.text("Primary Diagnosis", 15, y + 8);

  pdf.setFont("helvetica", "normal");
  pdf.text(`Condition: ${diagnosis || "N/A"}`, 15, y + 16);
  pdf.text(`Confidence: ${confidence ?? 0}%`, 15, y + 22);
  pdf.text(`Risk Level: ${risk || "Unknown"}`, 120, y + 22);

  y += 40;

  // =========================
  // INPUT IMAGE
  // =========================
  if (imageRef?.current) {
    try {
      const canvas = await html2canvas(imageRef.current, {
        scale: 2,
        useCORS: true,
      });

      const img = canvas.toDataURL("image/png");

      pdf.setFont("helvetica", "bold");
      pdf.text("Dermoscopic Image", 15, y);

      y += 5;

      pdf.addImage(img, "PNG", 15, y, 80, 80);
      y += 90;
    } catch (e) {
      console.warn("Image capture failed:", e);
    }
  }

  // =========================
  // CONFIDENCE GAUGE SNAPSHOT
  // =========================
  if (gaugeRef?.current) {
    try {
      const canvas = await html2canvas(gaugeRef.current, {
        scale: 2,
      });

      const img = canvas.toDataURL("image/png");

      pdf.setFont("helvetica", "bold");
      pdf.text("Model Confidence", 110, y - 85);

      pdf.addImage(img, "PNG", 110, y - 80, 70, 70);
    } catch (e) {
      console.warn("Gauge capture failed:", e);
    }
  }

  // =========================
  // NEW PAGE - EXPLANATION
  // =========================
  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Clinical Explanation", 15, 15);

  if (explanationRef?.current) {
    try {
      const canvas = await html2canvas(explanationRef.current, {
        scale: 2,
      });

      const img = canvas.toDataURL("image/png");

      pdf.addImage(img, "PNG", 10, 25, 190, 240);
    } catch (e) {
      console.warn("Explanation capture failed:", e);
    }
  }

  // =========================
  // NEW PAGE - SIMILAR CASES TABLE
  // =========================
  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Similar Cases", 15, 15);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let tableY = 25;

  // Table Header
  pdf.setFont("helvetica", "bold");
  pdf.text("Diagnosis", 15, tableY);
  pdf.text("Similarity", 70, tableY);
  pdf.text("Age", 110, tableY);
  pdf.text("Sex", 140, tableY);
  pdf.text("Location", 165, tableY);

  tableY += 6;

  pdf.setFont("helvetica", "normal");

  (similarCases || []).slice(0, 8).forEach((c) => {
    pdf.text(String(c.diagnosis || "—"), 15, tableY);
    pdf.text(`${((c.score || 0) * 100).toFixed(1)}%`, 70, tableY);
    pdf.text(String(c.age || "—"), 110, tableY);
    pdf.text(String(c.sex || "—"), 140, tableY);
    pdf.text(String(c.localization || "—"), 165, tableY);

    tableY += 7;
  });

  // =========================
  // FOOTER DISCLAIMER
  // =========================
  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Medical Disclaimer", 15, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text(
    "This AI-generated report is for educational and research purposes only.",
    15,
    35
  );

  pdf.text(
    "It is not a substitute for professional medical diagnosis.",
    15,
    42
  );

  // =========================
  // PAGE NUMBERS
  // =========================
  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 30,
      pageHeight - 10
    );
  }

  pdf.save(`${caseId}.pdf`);
}