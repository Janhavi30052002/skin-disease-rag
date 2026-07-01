export const diseaseMap = {
  akiec: "Actinic Keratosis",
  bcc: "Basal Cell Carcinoma",
  bkl: "Benign Keratosis",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Melanocytic Nevus",
  vasc: "Vascular Lesion",
};

export function getRisk(code) {
  switch (code) {
    case "mel":
    case "bcc":
    case "akiec":
      return "high";

    default:
      return "low";
  }
}