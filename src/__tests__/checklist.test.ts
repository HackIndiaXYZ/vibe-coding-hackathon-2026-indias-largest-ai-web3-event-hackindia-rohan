import { describe, it, expect } from "vitest";
import { generateChecklist } from "@/lib/checklist/engine";
import { DEMO_SCHOLARSHIP } from "@/lib/ai/demo-documents";
import { DEMO_PROFILE } from "@/lib/ai/demo-profile";

describe("Checklist Engine", () => {
  it("should generate checklist items for scholarship", () => {
    const items = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBe(DEMO_SCHOLARSHIP.requiredAttachments.length);
  });

  it("should mark caste certificate as available", () => {
    const items = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const casteCert = items.find((i) => i.documentName === "Caste Certificate");
    expect(casteCert).toBeDefined();
    expect(casteCert!.status).toBe("available");
  });

  it("should sort missing items to top", () => {
    const items = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const firstMissing = items.findIndex((i) => i.status === "missing");
    const firstAvailable = items.findIndex((i) => i.status === "available");
    if (firstMissing >= 0 && firstAvailable >= 0) {
      expect(firstMissing).toBeLessThan(firstAvailable);
    }
  });

  it("should include reason for each item", () => {
    const items = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    for (const item of items) {
      expect(item.reason.length).toBeGreaterThan(0);
    }
  });

  it("should mark mandatory items with higher urgency", () => {
    const items = generateChecklist(DEMO_SCHOLARSHIP, DEMO_PROFILE);
    const mandatoryItems = items.filter((i) => i.urgency === "high");
    expect(mandatoryItems.length).toBeGreaterThan(0);
  });
});
