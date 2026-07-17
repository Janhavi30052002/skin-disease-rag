import jsPDF from "jspdf";
// Standard html2canvas (last released 1.4.1) cannot parse the oklch()/oklab()
// color functions that Tailwind CSS v4 emits by default — it throws
// "Attempting to parse an unsupported color function". html2canvas-pro is a
// maintained, API-compatible fork that adds support for oklch/oklab/lab/lch/
// color(). Run: npm install html2canvas-pro (and you can remove the old
// html2canvas package if nothing else in the project depends on it).
import html2canvas from "html2canvas-pro";
import { diseaseMap } from "@/utils/diseaseMap";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const LEFT = 15;
const RIGHT = 195;
const CONTENT_WIDTH = RIGHT - LEFT;

const PRIMARY = [37, 99, 235];
const SUCCESS = [34, 197, 94];
const WARNING = [245, 158, 11];
const DANGER = [220, 38, 38];

function generateCaseId() {
  return "SKIN-" + Date.now().toString().slice(-8);
}

function getRiskColor(risk) {
  switch (risk) {
    case "High":
      return DANGER;
    case "Medium":
      return WARNING;
    case "Low":
      return SUCCESS;
    default:
      return [120, 120, 120];
  }
}

function drawHeader(pdf) {
  pdf.setFillColor(...PRIMARY);
  pdf.rect(0, 0, PAGE_WIDTH, 20, "F");

  pdf.setTextColor(255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("AI SKIN DISEASE DIAGNOSTIC REPORT", LEFT, 13);

  pdf.setTextColor(0);
}

function drawFooter(pdf, page, total) {
  pdf.setDrawColor(220);
  pdf.line(LEFT, 286, RIGHT, 286);

  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text("Vision Transformer + Retrieval Augmented Generation", LEFT, 292);
  pdf.text(`Page ${page} / ${total}`, 178, 292);

  pdf.setTextColor(0);
}

function drawSectionTitle(pdf, title, y) {
  pdf.setFillColor(242, 245, 250);
  pdf.roundedRect(LEFT, y, 180, 10, 2, 2, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(title, LEFT + 4, y + 7);

  return y + 16;
}

function drawLabel(pdf, label, value, y) {
  pdf.setFont("helvetica", "bold");
  pdf.text(label, LEFT, y);

  pdf.setFont("helvetica", "normal");
  pdf.text(String(value), 60, y);

  return y + 8;
}

function createCoverPage(pdf, caseId) {
  drawHeader(pdf);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("Dermatology AI Report", LEFT, 45);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Clinical Decision Support System", LEFT, 55);

  pdf.line(LEFT, 62, RIGHT, 62);

  let y = 85;
  y = drawLabel(pdf, "Case ID", caseId, y);
  y = drawLabel(pdf, "Generated", new Date().toLocaleString(), y);
  y = drawLabel(pdf, "AI Model", "Vision Transformer", y);
  y = drawLabel(pdf, "Knowledge Base", "Retrieval Augmented Generation", y);
}

/**
 * Renders a DOM node (a ref.current) to a canvas via html2canvas.
 * Returns null if the ref isn't mounted, so callers can skip that section
 * instead of throwing.
 */
async function captureNode(node) {
  if (!node) return null;

  return html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
}

/**
 * Places a captured canvas into the PDF at full content width, scaling
 * height proportionally. If the image is taller than one page it is sliced
 * into page-sized chunks and continued across new pages (each with its own
 * header). Returns the y-position to continue writing from on the
 * (possibly new) current page.
 */
function addCanvasImage(pdf, canvas, startY) {
  const imgWidthMm = CONTENT_WIDTH;
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;
  const usableHeight = PAGE_HEIGHT - 25; // leave room for the footer

  // Fits without splitting.
  if (startY + imgHeightMm <= usableHeight) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", LEFT, startY, imgWidthMm, imgHeightMm);
    return startY + imgHeightMm + 10;
  }

  // Needs to be sliced across multiple pages.
  const pxPerMm = canvas.width / imgWidthMm;
  const sliceHeightPx = Math.floor((usableHeight - startY) * pxPerMm);

  let offsetPx = 0;
  let remainingPx = canvas.height;
  let y = startY;
  let first = true;

  while (remainingPx > 0) {
    if (!first) {
      pdf.addPage();
      drawHeader(pdf);
      y = 28;
    }

    const currentSlicePx = first
      ? Math.min(sliceHeightPx, remainingPx)
      : Math.min(Math.floor((usableHeight - y) * pxPerMm), remainingPx);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = currentSlicePx;

    const ctx = sliceCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      offsetPx,
      canvas.width,
      currentSlicePx,
      0,
      0,
      canvas.width,
      currentSlicePx
    );

    const sliceHeightMm = (currentSlicePx * imgWidthMm) / canvas.width;
    pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", LEFT, y, imgWidthMm, sliceHeightMm);

    offsetPx += currentSlicePx;
    remainingPx -= currentSlicePx;
    y += sliceHeightMm + 10;
    first = false;
  }

  return y;
}

function drawSimilarCasesTable(pdf, similarCases, startY) {
  let y = startY;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Diagnosis", LEFT, y);
  pdf.text("Similarity", 95, y);
  pdf.text("Age", 125, y);
  pdf.text("Sex", 145, y);
  pdf.text("Location", 165, y);

  y += 4;
  pdf.setDrawColor(220);
  pdf.line(LEFT, y, RIGHT, y);
  y += 6;

  pdf.setFont("helvetica", "normal");

  similarCases.forEach((item) => {
    if (y > PAGE_HEIGHT - 25) {
      pdf.addPage();
      drawHeader(pdf);
      y = 30;
    }

    pdf.text(String(diseaseMap[item.diagnosis] ?? item.diagnosis ?? "-"), LEFT, y);
    pdf.text(`${(Number(item.score ?? 0) * 100).toFixed(1)}%`, 95, y);
    pdf.text(String(item.age ?? "-"), 125, y);
    pdf.text(String(item.sex ?? "-"), 145, y);
    pdf.text(String(item.localization ?? "-"), 165, y);

    y += 8;
  });

  return y;
}

export async function generatePDF({
  diagnosis,
  confidence,
  risk,
  explanationRef,
  imageRef,
  gaugeRef,
  similarCases = [],
}) {
  const pdf = new jsPDF("p", "mm", "a4");
  const caseId = generateCaseId();

  // ── Cover page ──────────────────────────────────────────────────────
  createCoverPage(pdf, caseId);

  // ── Diagnosis summary ───────────────────────────────────────────────
  pdf.addPage();
  drawHeader(pdf);
  let y = 30;

  y = drawSectionTitle(pdf, "Diagnosis Summary", y);
  y = drawLabel(pdf, "Predicted Disease", diagnosis || "Unknown", y);
  y = drawLabel(pdf, "Confidence", `${confidence ?? 0}%`, y);

  pdf.setFont("helvetica", "bold");
  pdf.text("Risk Level", LEFT, y);
  pdf.setTextColor(...getRiskColor(risk));
  pdf.text(String(risk || "Unknown"), 60, y);
  pdf.setTextColor(0);
  y += 12;

  // ── Confidence gauge (captured from the live DOM node) ──────────────
  const gaugeCanvas = await captureNode(gaugeRef?.current);
  if (gaugeCanvas) {
    y = drawSectionTitle(pdf, "Confidence Visualization", y);
    y = addCanvasImage(pdf, gaugeCanvas, y);
  }

  // ── Analyzed image ───────────────────────────────────────────────────
  const imageCanvas = await captureNode(imageRef?.current);
  if (imageCanvas) {
    pdf.addPage();
    drawHeader(pdf);
    y = 30;
    y = drawSectionTitle(pdf, "Analyzed Image", y);
    y = addCanvasImage(pdf, imageCanvas, y);
  }

  // ── Clinical explanation ─────────────────────────────────────────────
  const explanationCanvas = await captureNode(explanationRef?.current);
  if (explanationCanvas) {
    pdf.addPage();
    drawHeader(pdf);
    y = 30;
    y = drawSectionTitle(pdf, "Clinical Explanation", y);
    y = addCanvasImage(pdf, explanationCanvas, y);
  }

  // ── Similar cases (rendered as real text, not a screenshot) ─────────
  if (similarCases.length) {
    pdf.addPage();
    drawHeader(pdf);
    y = 30;
    y = drawSectionTitle(pdf, "Similar Cases", y);
    drawSimilarCasesTable(pdf, similarCases, y);
  }

  // ── Footer + page numbers on every page ──────────────────────────────
  const totalPages = pdf.internal.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    pdf.setPage(page);
    drawFooter(pdf, page, totalPages);
  }

  // This is the line that was missing — without it, nothing downloads.
  pdf.save(`${caseId}.pdf`);

  return caseId;
}