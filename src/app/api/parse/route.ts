import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/nim";
import { extractTextFromPDF, extractTextFromImage } from "@/lib/parsing/pdf-parser";
import { buildDocumentParsingPrompt } from "@/lib/ai/prompt-builder";
import { detectDocumentType, getFileExtension } from "@/lib/parsing/document-detector";
import type { ParsedDocument } from "@/types";

const parseSchema = z.object({
  title: z.string(),
  issuingAuthority: z.string(),
  category: z.string(),
  purpose: z.string(),
  deadline: z.string().nullable(),
  importantDates: z.array(z.object({ label: z.string(), date: z.string() })),
  eligibilityCriteria: z.array(z.string()),
  restrictions: z.array(z.string()),
  requiredFields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      type: z.enum(["text", "number", "date", "select", "file", "checkbox"]),
      required: z.boolean(),
    })
  ),
  requiredAttachments: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      format: z.string().optional(),
      mandatory: z.boolean(),
      urgency: z.enum(["high", "medium", "low"]),
      sectionReference: z.string().optional(),
    })
  ),
  fees: z.string().nullable(),
  signatureRequirements: z.array(z.string()),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
    })
  ),
  summary: z.string(),
  risks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(["high", "medium", "low"]),
    })
  ),
});

function classifyError(error: unknown): { code: string; message: string; status: number } {
  const err = error as { status?: number; statusCode?: number; message?: string; name?: string };
  const status = err.status || err.statusCode || 0;

  if (status === 401) {
    return { code: "AUTH_ERROR", message: "AI service authentication failed — check API key configuration.", status: 401 };
  }
  if (status === 429) {
    return { code: "RATE_LIMIT", message: "AI service rate limit reached — try again in a few moments.", status: 429 };
  }
  if (status === 503 || status === 502) {
    return { code: "SERVICE_UNAVAILABLE", message: "AI service temporarily unavailable — try demo mode instead.", status: 503 };
  }
  return { code: "PARSE_ERROR", message: "Failed to parse documents — try demo mode for a instant walkthrough.", status: 500 };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: "Maximum 5 files per upload" }, { status: 400 });
    }

    for (const file of files) {
      if (file.size > 10_000_000) {
        return NextResponse.json({ error: `File "${file.name}" exceeds 10MB limit` }, { status: 400 });
      }
    }

    const results: ParsedDocument[] = [];

    for (const file of files) {
      const fileType = getFileExtension(file.name);
      let rawText = "";

      if (fileType === "pdf") {
        const extraction = await extractTextFromPDF(file);
        rawText = extraction.text;
      } else if (fileType === "image") {
        rawText = await extractTextFromImage(file);
      } else {
        const text = await file.text();
        rawText = text;
      }

      if (!rawText || rawText.trim().length < 10) {
        rawText = `Document: ${file.name}. Unable to extract sufficient text. This may be a scanned document requiring OCR.`;
      }

      const documentType = detectDocumentType(rawText, file.name);
      const prompt = buildDocumentParsingPrompt(rawText, file.name);

    const { object } = await generateObject({
      model: model,
        schema: parseSchema,
        prompt,
      });

      const parsed: ParsedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...object,
        rawText,
        documentType: documentType as ParsedDocument["documentType"],
      };

      results.push(parsed);
    }

    return NextResponse.json({ documents: results });
  } catch (error) {
    console.error("Parse error:", error);
    const classified = classifyError(error);
    return NextResponse.json(
      { error: classified.message, code: classified.code },
      { status: classified.status }
    );
  }
}
