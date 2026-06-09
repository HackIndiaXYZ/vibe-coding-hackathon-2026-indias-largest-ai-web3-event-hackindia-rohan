import type { ParsedDocument, ApplicantProfile, EligibilityResult } from "@/types";

export function evaluateEligibility(
  document: ParsedDocument,
  profile: ApplicantProfile
): EligibilityResult {
  const criteria: EligibilityResult["criteria"] = [];
  let passed = 0;
  let failed = 0;

  for (const criterion of document.eligibilityCriteria) {
    const result = evaluateCriterion(criterion, document, profile);
    criteria.push(result);
    if (result.passed === "pass") passed++;
    else if (result.passed === "fail") failed++;
  }

  const total = criteria.length || 1;
  const passRate = passed / total;
  const failRate = failed / total;

  let status: EligibilityResult["status"];
  let confidence: number;

  if (failRate > 0.5) {
    status = "ineligible";
    confidence = Math.min(0.9, 0.5 + failRate * 0.4);
  } else if (passRate >= 0.7 && failRate === 0) {
    status = "eligible";
    confidence = Math.min(0.95, 0.6 + passRate * 0.35);
  } else {
    status = "uncertain";
    confidence = 0.4 + passRate * 0.2;
  }

  const verdict = buildVerdict(status, criteria, document.title);

  return { status, confidence, verdict, criteria };
}

function evaluateCriterion(
  criterion: string,
  document: ParsedDocument,
  profile: ApplicantProfile
): EligibilityResult["criteria"][0] {
  const lower = criterion.toLowerCase();

  // Income-based check
  if (lower.includes("income") || lower.includes("financial")) {
    const income = parseInt(profile.financial.familyIncome.replace(/,/g, ""), 10) || 0;
    const match = lower.match(/(?:below|under|less than|max(?:imum)?)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
    if (match) {
      const limit = parseInt(match[1].replace(/,/g, ""), 10);
      if (income <= limit) {
        return { criterion, passed: "pass", explanation: `Family income ₹${income.toLocaleString()} is within the limit of ₹${limit.toLocaleString()}`, profileValue: `₹${income.toLocaleString()}`, requiredValue: `Below ₹${limit.toLocaleString()}` };
      }
      return { criterion, passed: "fail", explanation: `Family income ₹${income.toLocaleString()} exceeds the limit of ₹${limit.toLocaleString()}`, profileValue: `₹${income.toLocaleString()}`, requiredValue: `Below ₹${limit.toLocaleString()}` };
    }
    return { criterion, passed: "uncertain", explanation: "Income criterion found but exact threshold unclear", profileValue: `₹${income.toLocaleString()}` };
  }

  // Education-based check
  if (lower.includes("education") || lower.includes("student") || lower.includes("enrolled") || lower.includes("course")) {
    if (profile.education.level && profile.education.institution) {
      return { criterion, passed: "pass", explanation: `Applicant is enrolled as a ${profile.education.level} student at ${profile.education.institution}`, profileValue: `${profile.education.level} - ${profile.education.course}` };
    }
    return { criterion, passed: "uncertain", explanation: "Education information may be incomplete", profileValue: `${profile.education.level || "Not provided"}` };
  }

  // Percentage/grades check
  if (lower.includes("percentage") || lower.includes("marks") || lower.includes("grade") || lower.includes("cgpa")) {
    const pct = parseInt(profile.education.percentage, 10) || 0;
    const match = lower.match(/(?:above|minimum|at least|more than|≥)\s*(\d+)/i);
    if (match) {
      const minPct = parseInt(match[1], 10);
      if (pct >= minPct) {
        return { criterion, passed: "pass", explanation: `Percentage ${pct}% meets the minimum requirement of ${minPct}%`, profileValue: `${pct}%`, requiredValue: `Minimum ${minPct}%` };
      }
      return { criterion, passed: "fail", explanation: `Percentage ${pct}% is below the minimum requirement of ${minPct}%`, profileValue: `${pct}%`, requiredValue: `Minimum ${minPct}%` };
    }
    return { criterion, passed: "uncertain", explanation: "Percentage criterion found but threshold unclear", profileValue: `${pct}%` };
  }

  // Age-based check
  if (lower.includes("age")) {
    const dob = new Date(profile.personal.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const match = lower.match(/(?:between|age)\s*(\d+)\s*(?:to|-)\s*(\d+)/i);
    if (match) {
      const minAge = parseInt(match[1], 10);
      const maxAge = parseInt(match[2], 10);
      if (age >= minAge && age <= maxAge) {
        return { criterion, passed: "pass", explanation: `Age ${age} is within the required range ${minAge}-${maxAge}`, profileValue: `${age} years`, requiredValue: `${minAge}-${maxAge} years` };
      }
      return { criterion, passed: "fail", explanation: `Age ${age} is outside the required range ${minAge}-${maxAge}`, profileValue: `${age} years`, requiredValue: `${minAge}-${maxAge} years` };
    }
    return { criterion, passed: "uncertain", explanation: "Age criterion found but range unclear", profileValue: `${age} years` };
  }

  // Category-based check
  if (lower.includes("category") || lower.includes("caste") || lower.includes("sc") || lower.includes("st") || lower.includes("obc") || lower.includes("ews")) {
    const categoryLower = profile.personal.category.toLowerCase();
    if (lower.includes(categoryLower) || lower.includes("all") || lower.includes("general")) {
      return { criterion, passed: "pass", explanation: `Applicant category '${profile.personal.category}' matches the requirement`, profileValue: profile.personal.category };
    }
    return { criterion, passed: "uncertain", explanation: "Category requirement needs manual verification", profileValue: profile.personal.category };
  }

  // State/location check
  if (lower.includes("state") || lower.includes("domicile") || lower.includes("resident")) {
    if (profile.personal.state) {
      return { criterion, passed: "uncertain", explanation: `Applicant is from ${profile.personal.state}. Verify if this state is eligible.`, profileValue: profile.personal.state };
    }
    return { criterion, passed: "uncertain", explanation: "State information needed for verification" };
  }

  // Aadhaar / identity check
  if (lower.includes("aadhaar") || lower.includes("identity")) {
    if (profile.documents.aadhaar) {
      return { criterion, passed: "pass", explanation: "Aadhaar is available", profileValue: "Available" };
    }
    return { criterion, passed: "fail", explanation: "Aadhaar is required but not available", profileValue: "Not available" };
  }

  // Default: mark as uncertain
  return { criterion, passed: "uncertain", explanation: "This criterion requires manual review" };
}

function buildVerdict(
  status: EligibilityResult["status"],
  criteria: EligibilityResult["criteria"],
  docTitle: string
): string {
  const passed = criteria.filter((c) => c.passed === "pass").length;
  const failed = criteria.filter((c) => c.passed === "fail").length;
  const total = criteria.length;

  if (status === "eligible") {
    return `You appear to be eligible for ${docTitle}. ${passed} out of ${total} criteria are met.`;
  }
  if (status === "ineligible") {
    const failedCriteria = criteria.filter((c) => c.passed === "fail").map((c) => c.criterion).join(", ");
    return `You may not be eligible for ${docTitle}. Failed criteria: ${failedCriteria}`;
  }
  return `Eligibility for ${docTitle} is uncertain. ${passed} criteria pass, ${failed} fail, and ${total - passed - failed} need manual review.`;
}
