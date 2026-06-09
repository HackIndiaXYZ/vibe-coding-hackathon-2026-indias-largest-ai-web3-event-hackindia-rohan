import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/nim";
import { buildClauseSimplificationPrompt } from "@/lib/ai/prompt-builder";

const simplifySchema = z.object({
  simplified: z.string(),
  keyPoints: z.array(z.string()),
  actionItems: z.array(z.string()),
});

function classifyError(error: unknown): { code: string; message: string; status: number } {
  const err = error as { status?: number; statusCode?: number };
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
  return { code: "SIMPLIFY_ERROR", message: "Failed to simplify clause — try demo mode for a instant walkthrough.", status: 500 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clause, documentTitle, lang } = body as {
      clause: string;
      documentTitle: string;
      lang?: "en" | "hi";
    };

    if (!clause) {
      return NextResponse.json(
        { error: "No clause text provided" },
        { status: 400 }
      );
    }

    const prompt = buildClauseSimplificationPrompt(clause, documentTitle || "Unknown Document", lang || "en");

    const { object } = await generateObject({
      model: model,
      schema: simplifySchema,
      prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Simplify error:", error);
    const classified = classifyError(error);
    return NextResponse.json(
      { error: classified.message, code: classified.code },
      { status: classified.status }
    );
  }
}
