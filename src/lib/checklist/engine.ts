import type { ParsedDocument, ApplicantProfile, ChecklistItem } from "@/types";

export function generateChecklist(
  document: ParsedDocument,
  profile: ApplicantProfile
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  for (const attachment of document.requiredAttachments) {
    const status = checkDocumentAvailability(attachment.name, profile);
    items.push({
      id: attachment.id,
      documentName: attachment.name,
      description: attachment.description,
      status,
      reason: buildReason(attachment.name, status, attachment.mandatory),
      format: attachment.format,
      urgency: attachment.mandatory ? attachment.urgency : "low",
      sectionReference: attachment.sectionReference,
    });
  }

  // Sort by urgency: high first
  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  items.sort((a, b) => {
    if (a.status === "missing" && b.status !== "missing") return -1;
    if (a.status !== "missing" && b.status === "missing") return 1;
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return items;
}

function checkDocumentAvailability(
  docName: string,
  profile: ApplicantProfile
): "available" | "missing" | "unknown" {
  const name = docName.toLowerCase();

  if (name.includes("aadhaar") || name.includes("aadhar") || name.includes("identity proof")) {
    return profile.documents.aadhaar ? "available" : "unknown";
  }
  if (name.includes("pan card") || name.includes("pan")) {
    return profile.documents.panCard ? "available" : "unknown";
  }
  if (name.includes("income certificate") || name.includes("income proof")) {
    return profile.documents.incomeCertificate ? "available" : "unknown";
  }
  if (name.includes("caste certificate") || name.includes("category certificate")) {
    return profile.documents.casteCertificate ? "available" : "unknown";
  }
  if (name.includes("marksheet") || name.includes("transcript") || name.includes("academic")) {
    return profile.documents.marksheet ? "available" : "unknown";
  }
  if (name.includes("admission") || name.includes("offer letter")) {
    return profile.documents.admissionLetter ? "available" : "unknown";
  }
  if (name.includes("bank passbook") || name.includes("bank statement")) {
    return profile.documents.bankPassbook ? "available" : "unknown";
  }
  if (name.includes("photograph") || name.includes("photo")) {
    return profile.documents.photograph ? "available" : "unknown";
  }
  if (name.includes("signature")) {
    return profile.documents.signature ? "available" : "unknown";
  }

  return "unknown";
}

function buildReason(
  docName: string,
  status: "available" | "missing" | "unknown",
  mandatory: boolean
): string {
  if (status === "available") {
    return `You have ${docName} available in your profile.`;
  }
  if (status === "missing") {
    return mandatory
      ? `Required: ${docName} is mandatory for this application. Please upload it.`
      : `Recommended: ${docName} would strengthen your application.`;
  }
  return mandatory
    ? `Please check if you have ${docName}. It is required for this application.`
    : `Please check if you have ${docName}. It may be helpful.`;
}
