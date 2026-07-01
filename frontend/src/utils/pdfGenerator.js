import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF({
  diagnosis,
  confidence,
  risk,
  explanationRef,
  imageRef,
}) {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  let y = 15;

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Skin Disease AI Diagnostic Report", 15, y);

  y += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, y);

  y += 15;

  // Diagnosis block
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Diagnosis", 15, y);

  y += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`Condition: ${diagnosis || "N/A"}`, 15, y);
  y += 7;

  pdf.text(`Confidence: ${confidence ?? 0}%`, 15, y);
  y += 7;

  pdf.text(`Risk Level: ${risk || "Unknown"}`, 15, y);

  y += 10;

  // Image capture (uploaded image OR preview container)
  if (imageRef?.current) {
    const canvas = await html2canvas(imageRef.current);
    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 15, y, 80, 80);
    y += 90;
  }

  // Explanation capture (important section)
  if (explanationRef?.current) {
    const canvas = await html2canvas(explanationRef.current);
    const imgData = canvas.toDataURL("image/png");

    pdf.addPage();
    pdf.text("Clinical Explanation", 15, 15);
    pdf.addImage(imgData, "PNG", 10, 25, 190, 240);
  }

  pdf.save("skin-disease-report.pdf");
}