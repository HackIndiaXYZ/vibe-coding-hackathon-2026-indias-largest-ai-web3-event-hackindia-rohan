import type { ParsedDocument, ApplicantProfile, DraftAnswer } from "@/types";

export function generateDraftAnswers(
  document: ParsedDocument,
  profile: ApplicantProfile
): DraftAnswer[] {
  return document.requiredFields.map((field) => {
    const mapping = mapFieldToProfile(field.name, profile);
    return {
      fieldId: field.id,
      fieldName: field.name,
      value: mapping.value,
      confidence: mapping.confidence,
      source: mapping.source,
      reasoning: mapping.reasoning,
    };
  });
}

interface FieldMapping {
  value: string;
  confidence: "auto-filled" | "suggested" | "missing" | "needs-review";
  source?: string;
  reasoning?: string;
}

function mapFieldToProfile(fieldName: string, profile: ApplicantProfile): FieldMapping {
  const name = fieldName.toLowerCase();

  // Name fields
  if (name.includes("first name") || name.includes("given name")) {
    return { value: profile.personal.firstName, confidence: "auto-filled", source: "Profile > First Name" };
  }
  if (name.includes("last name") || name.includes("surname") || name.includes("family name")) {
    return { value: profile.personal.lastName, confidence: "auto-filled", source: "Profile > Last Name" };
  }
  if (name.includes("full name") || name === "name" || name.includes("applicant name") || name.includes("student name")) {
    return { value: `${profile.personal.firstName} ${profile.personal.lastName}`, confidence: "auto-filled", source: "Profile > Full Name" };
  }

  // Contact
  if (name.includes("email") || name.includes("e-mail")) {
    return { value: profile.personal.email, confidence: "auto-filled", source: "Profile > Email" };
  }
  if (name.includes("phone") || name.includes("mobile") || name.includes("contact")) {
    return { value: profile.personal.phone, confidence: "auto-filled", source: "Profile > Phone" };
  }
  if (name.includes("address") || name.includes("postal")) {
    return { value: profile.personal.address, confidence: "auto-filled", source: "Profile > Address" };
  }
  if (name.includes("city") || name.includes("town")) {
    return { value: profile.personal.city, confidence: "auto-filled", source: "Profile > City" };
  }
  if (name.includes("state") || name.includes("province")) {
    return { value: profile.personal.state, confidence: "auto-filled", source: "Profile > State" };
  }
  if (name.includes("pincode") || name.includes("pin code") || name.includes("postal code") || name.includes("zip")) {
    return { value: profile.personal.pincode, confidence: "auto-filled", source: "Profile > Pincode" };
  }

  // Personal
  if (name.includes("date of birth") || name.includes("dob") || name.includes("birth date")) {
    return { value: profile.personal.dateOfBirth, confidence: "auto-filled", source: "Profile > DOB" };
  }
  if (name.includes("gender") || name.includes("sex")) {
    return { value: profile.personal.gender, confidence: "auto-filled", source: "Profile > Gender" };
  }
  if (name.includes("nationality")) {
    return { value: profile.personal.nationality, confidence: "auto-filled", source: "Profile > Nationality" };
  }
  if (name.includes("category") || name.includes("caste") || name.includes("social category")) {
    return { value: profile.personal.category, confidence: "auto-filled", source: "Profile > Category" };
  }

  // Education
  if (name.includes("institution") || name.includes("college") || name.includes("university") || name.includes("school")) {
    return { value: profile.education.institution, confidence: "auto-filled", source: "Profile > Institution" };
  }
  if (name.includes("course") || name.includes("program") || name.includes("degree") || name.includes("branch")) {
    return { value: profile.education.course, confidence: "auto-filled", source: "Profile > Course" };
  }
  if (name.includes("year") && name.includes("study")) {
    return { value: profile.education.year, confidence: "auto-filled", source: "Profile > Year" };
  }
  if (name.includes("percentage") || name.includes("marks") || name.includes("grade") || name.includes("cgpa") || name.includes("gpa")) {
    return { value: profile.education.percentage + "%", confidence: "auto-filled", source: "Profile > Percentage" };
  }
  if (name.includes("roll") || name.includes("enrollment") || name.includes("reg no")) {
    return { value: profile.education.rollNumber || "", confidence: profile.education.rollNumber ? "auto-filled" : "missing", source: "Profile > Roll Number" };
  }

  // Financial
  if (name.includes("income") || name.includes("family income") || name.includes("annual income")) {
    return { value: `₹${profile.financial.familyIncome}`, confidence: "auto-filled", source: "Profile > Family Income" };
  }
  if (name.includes("bank name")) {
    return { value: profile.financial.bankName || "", confidence: profile.financial.bankName ? "auto-filled" : "missing", source: "Profile > Bank Name" };
  }
  if (name.includes("account number") || name.includes("bank account")) {
    return { value: profile.financial.accountNumber || "", confidence: profile.financial.accountNumber ? "auto-filled" : "missing", source: "Profile > Account Number" };
  }
  if (name.includes("ifsc")) {
    return { value: profile.financial.ifscCode || "", confidence: profile.financial.ifscCode ? "auto-filled" : "missing", source: "Profile > IFSC Code" };
  }

  // Document-related
  if (name.includes("aadhaar") || name.includes("aadhar")) {
    return { value: profile.documents.aadhaar ? "Available" : "", confidence: profile.documents.aadhaar ? "auto-filled" : "missing", reasoning: "Aadhaar document status" };
  }
  if (name.includes("pan")) {
    return { value: profile.documents.panCard ? "Available" : "", confidence: profile.documents.panCard ? "auto-filled" : "missing", reasoning: "PAN card document status" };
  }

  // Signature / Declaration
  if (name.includes("signature") || name.includes("declaration") || name.includes("place")) {
    return { value: profile.personal.city, confidence: "suggested", source: "Profile > City (as signing place)", reasoning: "Using city as signing location" };
  }

  // Default
  return { value: "", confidence: "missing", reasoning: `Could not auto-map "${fieldName}" to profile data` };
}
