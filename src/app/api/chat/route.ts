import { NextRequest } from "next/server";
import { streamText } from "ai";
import { model } from "@/lib/ai/nim";
import { buildChatPrompt } from "@/lib/ai/prompt-builder";
import type { ParsedDocument, ApplicantProfile, EligibilityResult, ChatMessage } from "@/types";

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
  return { code: "CHAT_ERROR", message: "Failed to process question — try demo mode for a instant walkthrough.", status: 500 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, document, profile, eligibility, history, lang } = body as {
      question: string;
      document: ParsedDocument;
      profile: ApplicantProfile;
      eligibility: EligibilityResult | null;
      history: ChatMessage[];
      lang?: "en" | "hi";
    };

    if (!question || !document || !profile) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (question.length > 2000) {
      return Response.json({ error: "Question too long (max 2000 characters)" }, { status: 400 });
    }

    const prompt = buildChatPrompt(question, document, profile, eligibility, history || [], lang || "en");

    const result = streamText({
      model,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    const classified = classifyError(error);
    return Response.json(
      { error: classified.message, code: classified.code },
      { status: classified.status }
    );
  }
}
