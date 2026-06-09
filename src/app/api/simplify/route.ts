import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/gemini";
import { buildClauseSimplificationPrompt } from "@/lib/ai/prompt-builder";

const simplifySchema = z.object({
  simplified: z.string(),
  keyPoints: z.array(z.string()),
  actionItems: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clause, documentTitle } = body as {
      clause: string;
      documentTitle: string;
    };

    if (!clause) {
      return NextResponse.json(
        { error: "No clause text provided" },
        { status: 400 }
      );
    }

    const prompt = buildClauseSimplificationPrompt(clause, documentTitle || "Unknown Document");

    const { object } = await generateObject({
      model: model,
      schema: simplifySchema,
      prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Simplify error:", error);
    return NextResponse.json(
      { error: "Failed to simplify clause" },
      { status: 500 }
    );
  }
}
