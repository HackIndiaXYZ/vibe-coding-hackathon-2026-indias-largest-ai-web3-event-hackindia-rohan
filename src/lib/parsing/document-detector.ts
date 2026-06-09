export type DocumentType = "scholarship" | "reimbursement" | "admission" | "government" | "other";

const SCHOLARSHIP_KEYWORDS = ["scholarship", "fellowship", "grant", "bursary", "stipend", "merit", "need-based"];
const REIMBURSEMENT_KEYWORDS = ["reimbursement", "insurance", "claim", "hospital", "medical", "health", "cashless"];
const ADMISSION_KEYWORDS = ["admission", "enrollment", "registration", "application form", "university", "college"];
const GOVERNMENT_KEYWORDS = ["government", "ministry", "dept", "department", "official", "certificate", "license"];

export function detectDocumentType(text: string, fileName: string): DocumentType {
  const lowerText = text.toLowerCase();
  const lowerName = fileName.toLowerCase();

  const scores = {
    scholarship: 0,
    reimbursement: 0,
    admission: 0,
    government: 0,
  };

  for (const keyword of SCHOLARSHIP_KEYWORDS) {
    if (lowerText.includes(keyword) || lowerName.includes(keyword)) scores.scholarship += 2;
  }
  for (const keyword of REIMBURSEMENT_KEYWORDS) {
    if (lowerText.includes(keyword) || lowerName.includes(keyword)) scores.reimbursement += 2;
  }
  for (const keyword of ADMISSION_KEYWORDS) {
    if (lowerText.includes(keyword) || lowerName.includes(keyword)) scores.admission += 2;
  }
  for (const keyword of GOVERNMENT_KEYWORDS) {
    if (lowerText.includes(keyword) || lowerName.includes(keyword)) scores.government += 2;
  }

  const maxScore = Math.max(scores.scholarship, scores.reimbursement, scores.admission, scores.government);
  
  if (maxScore === 0) return "other";
  if (scores.scholarship === maxScore) return "scholarship";
  if (scores.reimbursement === maxScore) return "reimbursement";
  if (scores.admission === maxScore) return "admission";
  return "government";
}

export function getFileExtension(fileName: string): "pdf" | "image" | "doc" {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "tiff"].includes(ext)) return "image";
  return "doc";
}
