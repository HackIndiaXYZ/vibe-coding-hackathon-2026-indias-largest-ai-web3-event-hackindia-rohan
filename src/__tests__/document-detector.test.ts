import { describe, it, expect } from "vitest";
import { detectDocumentType, getFileExtension } from "@/lib/parsing/document-detector";

describe("Document Detector", () => {
  it("should detect scholarship documents", () => {
    const type = detectDocumentType(
      "This is a scholarship application form for SC/ST students",
      "scholarship_form.pdf"
    );
    expect(type).toBe("scholarship");
  });

  it("should detect reimbursement documents", () => {
    const type = detectDocumentType(
      "Employee medical reimbursement claim form",
      "claim.pdf"
    );
    expect(type).toBe("reimbursement");
  });

  it("should detect admission documents", () => {
    const type = detectDocumentType(
      "University admission application for B.Tech program",
      "admission.pdf"
    );
    expect(type).toBe("admission");
  });

  it("should return 'other' for unknown documents", () => {
    const type = detectDocumentType(
      "Hello world, this is a random file",
      "notes.txt"
    );
    expect(type).toBe("other");
  });

  it("should detect file extension for PDF", () => {
    expect(getFileExtension("document.pdf")).toBe("pdf");
  });

  it("should detect file extension for images", () => {
    expect(getFileExtension("photo.jpg")).toBe("image");
    expect(getFileExtension("scan.png")).toBe("image");
  });
});
