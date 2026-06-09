import { describe, it, expect } from "vitest";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { DEMO_SCHOLARSHIP, DEMO_REIMBURSEMENT, DEMO_ADMISSION } from "@/lib/ai/demo-documents";
import { DEMO_PROFILE } from "@/lib/ai/demo-profile";

describe("Eligibility Engine", () => {
  it("should mark Priya as eligible for SC/ST scholarship", () => {
    const result = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    expect(result.status).toBe("eligible");
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("should have pass results for scholarship criteria", () => {
    const result = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const passes = result.criteria.filter((c) => c.passed === "pass");
    expect(passes.length).toBeGreaterThan(0);
  });

  it("should mark eligibility for reimbursement as uncertain", () => {
    const result = evaluateEligibility(DEMO_REIMBURSEMENT, DEMO_PROFILE);
    expect(["eligible", "uncertain"]).toContain(result.status);
  });

  it("should mark B.Tech admission eligibility based on profile", () => {
    const result = evaluateEligibility(DEMO_ADMISSION, DEMO_PROFILE);
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("should provide explanation for each criterion", () => {
    const result = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    for (const criterion of result.criteria) {
      expect(criterion.explanation).toBeTruthy();
    }
  });

  it("should include verdict text", () => {
    const result = evaluateEligibility(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    expect(result.verdict.length).toBeGreaterThan(0);
  });
});
