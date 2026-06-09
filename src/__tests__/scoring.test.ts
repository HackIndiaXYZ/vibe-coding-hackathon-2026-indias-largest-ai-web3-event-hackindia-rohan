import { describe, it, expect } from "vitest";
import { calculateReadiness } from "@/lib/scoring/engine";
import { generateDraftAnswers } from "@/lib/profile/field-mapper";
import { generateChecklist } from "@/lib/checklist/engine";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { DEMO_SCHOLARSHIP } from "@/lib/ai/demo-documents";
import { DEMO_PROFILE } from "@/lib/ai/demo-profile";

describe("Scoring Engine", () => {
  it("should calculate readiness score", () => {
    const eligibility = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const draftAnswers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const checklist = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const score = calculateReadiness(DEMO_SCHOLARSHIP, DEMO_PROFILE, eligibility, draftAnswers, checklist);

    expect(score.overall).toBeGreaterThan(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.breakdown.length).toBe(4);
  });

  it("should include all breakdown categories", () => {
    const eligibility = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const draftAnswers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const checklist = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const score = calculateReadiness(DEMO_SCHOLARSHIP, DEMO_PROFILE, eligibility, draftAnswers, checklist);

    const categories = score.breakdown.map((b) => b.category);
    expect(categories).toContain("Eligibility");
    expect(categories).toContain("Documents");
    expect(categories).toContain("Field Completion");
    expect(categories).toContain("Profile Completeness");
  });

  it("should have transparent breakdown with details", () => {
    const eligibility = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const draftAnswers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const checklist = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const score = calculateReadiness(DEMO_SCHOLARSHIP, DEMO_PROFILE, eligibility, draftAnswers, checklist);

    for (const item of score.breakdown) {
      expect(item.details.length).toBeGreaterThan(0);
    }
  });
});
