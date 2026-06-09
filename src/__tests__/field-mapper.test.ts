import { describe, it, expect } from "vitest";
import { generateDraftAnswers } from "@/lib/profile/field-mapper";
import { DEMO_SCHOLARSHIP } from "@/lib/ai/demo-documents";
import { DEMO_PROFILE } from "@/lib/ai/demo-profile";

describe("Field Mapper", () => {
  it("should generate draft answers for all required fields", () => {
    const answers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    expect(answers.length).toBe(DEMO_SCHOLARSHIP.requiredFields.length);
  });

  it("should auto-fill name field from profile", () => {
    const answers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const nameField = answers.find((a) => a.fieldName === "Full Name");
    expect(nameField).toBeDefined();
    expect(nameField!.value).toBe("Priya Sharma");
    expect(nameField!.confidence).toBe("auto-filled");
  });

  it("should auto-fill category field from profile", () => {
    const answers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const catField = answers.find((a) => a.fieldName === "Category");
    expect(catField).toBeDefined();
    expect(catField!.value).toBe("SC");
    expect(catField!.confidence).toBe("auto-filled");
  });

  it("should auto-fill income field from profile", () => {
    const answers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const incomeField = answers.find((a) => a.fieldName === "Annual Family Income");
    expect(incomeField).toBeDefined();
    expect(incomeField!.value).toContain("180000");
    expect(incomeField!.confidence).toBe("auto-filled");
  });

  it("should mark unknown fields as missing", () => {
    const answers = generateDraftAnswers(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const missing = answers.filter((a) => a.confidence === "missing");
    expect(missing.length).toBeLessThan(answers.length);
  });
});
