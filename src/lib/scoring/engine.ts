import type {
  ParsedDocument,
  ApplicantProfile,
  EligibilityResult,
  DraftAnswer,
  ChecklistItem,
  ReadinessScore,
} from "@/types";

export function calculateReadiness(
  document: ParsedDocument,
  profile: ApplicantProfile,
  eligibility: EligibilityResult,
  draftAnswers: DraftAnswer[],
  checklist: ChecklistItem[]
): ReadinessScore {
  const eligibilityScore = calculateEligibilityScore(eligibility);
  const documentsScore = calculateDocumentsScore(checklist);
  const fieldsScore = calculateFieldsScore(draftAnswers);
  const completenessScore = calculateCompletenessScore(document, profile);

  const overall = Math.round(
    eligibilityScore * 0.3 +
    documentsScore * 0.3 +
    fieldsScore * 0.25 +
    completenessScore * 0.15
  );

  return {
    overall,
    eligibility: eligibilityScore,
    documents: documentsScore,
    fields: fieldsScore,
    completeness: completenessScore,
    breakdown: [
      {
        category: "Eligibility",
        score: eligibilityScore,
        details: eligibilityScore >= 80
          ? "Strong eligibility match"
          : eligibilityScore >= 50
          ? "Partial eligibility - some criteria need review"
          : "Eligibility concerns detected",
      },
      {
        category: "Documents",
        score: documentsScore,
        details: documentsScore >= 80
          ? "Most required documents are available"
          : documentsScore >= 50
          ? "Some required documents are missing"
          : "Critical documents are missing",
      },
      {
        category: "Field Completion",
        score: fieldsScore,
        details: fieldsScore >= 80
          ? "Most fields can be auto-filled"
          : fieldsScore >= 50
          ? "Several fields need manual input"
          : "Many fields are missing data",
      },
      {
        category: "Profile Completeness",
        score: completenessScore,
        details: completenessScore >= 80
          ? "Profile is comprehensive"
          : completenessScore >= 50
          ? "Profile could use more detail"
          : "Profile is incomplete",
      },
    ],
  };
}

function calculateEligibilityScore(eligibility: EligibilityResult): number {
  const passCount = eligibility.criteria.filter((c) => c.passed === "pass").length;
  const total = eligibility.criteria.length || 1;
  const passRate = passCount / total;
  const confidence = eligibility.confidence;
  return Math.round(passRate * confidence * 100);
}

function calculateDocumentsScore(checklist: ChecklistItem[]): number {
  if (checklist.length === 0) return 50;
  const available = checklist.filter((i) => i.status === "available").length;
  const total = checklist.length;

  // Penalize more for missing high-urgency items
  const highUrgencyMissing = checklist.filter(
    (i) => i.status === "missing" && i.urgency === "high"
  ).length;

  const baseScore = (available / total) * 100;
  const penalty = highUrgencyMissing * 15;
  return Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
}

function calculateFieldsScore(answers: DraftAnswer[]): number {
  if (answers.length === 0) return 50;

  const scores: number[] = answers.map((a) => {
    switch (a.confidence) {
      case "auto-filled": return 100;
      case "suggested": return 70;
      case "needs-review": return 40;
      case "missing": return 0;
    }
  });

  return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
}

function calculateCompletenessScore(
  document: ParsedDocument,
  profile: ApplicantProfile
): number {
  let filled = 0;
  let total = 0;

  // Check personal info
  const personalFields = [
    profile.personal.firstName,
    profile.personal.lastName,
    profile.personal.email,
    profile.personal.phone,
    profile.personal.category,
    profile.personal.state,
  ];
  total += personalFields.length;
  filled += personalFields.filter((f) => f.length > 0).length;

  // Check education
  const eduFields = [
    profile.education.level,
    profile.education.institution,
    profile.education.course,
    profile.education.percentage,
  ];
  total += eduFields.length;
  filled += eduFields.filter((f) => f.length > 0).length;

  // Check financial
  const finFields = [
    profile.financial.familyIncome,
  ];
  total += finFields.length;
  filled += finFields.filter((f) => f.length > 0).length;

  // Check documents availability
  const docFields = Object.values(profile.documents);
  total += docFields.length;
  filled += docFields.filter((f) => f === true).length;

  return total > 0 ? Math.round((filled / total) * 100) : 50;
}
