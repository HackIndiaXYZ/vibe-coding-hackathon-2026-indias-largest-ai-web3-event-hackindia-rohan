import { NextRequest } from "next/server";
import { streamText } from "ai";
import { model } from "@/lib/ai/nim";
import { buildChatPrompt } from "@/lib/ai/prompt-builder";
import type { ParsedDocument, ApplicantProfile, EligibilityResult, ChatMessage } from "@/types";

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
    return Response.json({ error: "Failed to process question" }, { status: 500 });
  }
}
