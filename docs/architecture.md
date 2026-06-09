# Sahayak AI - Architecture

## System Overview

Sahayak AI is a Next.js 16 application with a clean separation between AI-powered extraction, deterministic logic, and the user interface.

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│  Next.js 16 App Router + Tailwind + shadcn/ui   │
├─────────────────────────────────────────────────┤
│                  API Routes                      │
│  /api/parse  /api/chat  /api/demo               │
├─────────────────────────────────────────────────┤
│               Core Logic Layer                   │
│  Parsing │ Eligibility │ Checklist │ Scoring     │
├─────────────────────────────────────────────────┤
│                AI Integration                    │
│  Vercel AI SDK + NVIDIA NIM (Llama 3.3 70B)     │
│  Structured output with Zod schemas             │
└─────────────────────────────────────────────────┘
```

## Upload / Parsing Flow

1. **User uploads** PDF or image via React Dropzone
2. **PDF.js** extracts text from each page
3. **Document detector** identifies document type from content + filename
4. **NVIDIA NIM (Llama 3.3 70B)** parses raw text into structured `ParsedDocument` schema
5. **Zod validation** ensures output matches expected structure
6. **Results stored** in client-side state via React Context

## Grounding Architecture

Every AI output is grounded in:
- **Extracted text** from the uploaded document
- **Structured sections** parsed during extraction
- **User profile data** provided by the applicant
- **Deterministic rules** for eligibility and field mapping

The chat assistant (Ask Sahayak) receives the full document context, profile, and eligibility results as a system prompt. It must cite document sections for every answer.

## Why This Architecture

- **Fast**: No database needed for demo. All state in React Context.
- **Safe**: AI outputs validated against Zod schemas before rendering.
- **Transparent**: Eligibility and scoring use deterministic logic with explainable reasoning.
- **Hackathon-friendly**: Single deployment on Vercel. No complex infrastructure.
