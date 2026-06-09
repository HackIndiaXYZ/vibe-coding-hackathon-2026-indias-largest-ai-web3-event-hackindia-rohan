import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/gemini";
import { buildChatPrompt } from "@/lib/ai/prompt-builder";
import type { ParsedDocument, ApplicantProfile, EligibilityResult, ChatMessage } from "@/types";

const chatResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(
    z.object({
      text: z.string(),
      source: z.string(),
      section: z.string().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, document, profile, eligibility, history } = body as {
      question: string;
      document: ParsedDocument;
      profile: ApplicantProfile;
      eligibility: EligibilityResult | null;
      history: ChatMessage[];
    };

    if (!question || !document || !profile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = buildChatPrompt(question, document, profile, eligibility, history || []);

    const { object } = await generateObject({
      model: model,
      schema: chatResponseSchema,
      prompt,
    });

    return NextResponse.json({
      id: `msg-${Date.now()}`,
      role: "assistant" as const,
      content: object.answer,
      citations: object.citations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
