# Sahayak AI

> AI copilot for forms, paperwork, and document-heavy applications.

**Tagline:** Turn confusing forms into clear action plans.

## Problem

Millions of students, parents, and workers in India face confusing forms for scholarships, admissions, reimbursements, and government schemes. Requirements are buried in legal language, deadlines are unclear, and missing one document means rejection.

## Solution

Sahayak AI explains forms in plain language, extracts structured requirements, checks eligibility, auto-drafts answers, generates document checklists, and creates submission-ready action plans — all grounded in the actual uploaded documents.

## Key Features

- **Document Parsing**: Upload PDFs or images. AI extracts title, authority, eligibility, fields, attachments, and risks.
- **Eligibility Engine**: Deterministic + AI evaluation with clear pass/fail/uncertain verdicts and reasoning.
- **Field Completion**: Auto-drafts form answers from your profile with confidence labels.
- **Missing Documents**: Prioritized checklist showing what you have, what's missing, and why.
- **Ask Sahayak**: Grounded chat that answers questions with document citations.
- **Readiness Score**: Transparent scoring with breakdown and submission plan.
- **Demo Mode**: Works instantly with 3 pre-loaded sample documents.

## Architecture

```
Frontend: Next.js 16 + React + TypeScript + Tailwind CSS v4 + shadcn/ui
AI: Vercel AI SDK + Google Gemini 2.0 Flash
Parsing: pdfjs-dist + document type detection
Logic: Deterministic eligibility, field mapping, scoring
```

## Setup

```bash
# Install
npm install

# Environment
cp .env.example .env.local
# Add: GOOGLE_GENERATIVE_AI_API_KEY=your-key

# Run
npm run dev
```

## Demo Mode

No API key needed. Click "Try Demo" → "Load Demo & Start" to explore with pre-loaded scholarship, reimbursement, and admission documents.

## How AI is Used

1. **OCR & Extraction** — PDF.js + Gemini parse documents into structured schemas
2. **Eligibility** — Deterministic rules + AI interpretation for complex criteria
3. **Field Mapping** — Intelligent profile-to-field matching with confidence labels
4. **Grounded Chat** — RAG-style context injection with document citations
5. **Scoring** — Transparent, explainable readiness calculation

## Limitations

- Demo mode uses pre-parsed documents for speed
- OCR for scanned images is simulated (production would use Tesseract.js or cloud OCR)
- Chat responses depend on Gemini API availability

## Future Work

- Real OCR pipeline with Tesseract.js
- Supabase integration for persistent profiles
- Multi-language support
- Batch document processing
- Agent-assisted form filing
- Mobile app

## Docs

- [Architecture](docs/architecture.md)
- [Demo Script](docs/demo-script.md)
- [Pitch](docs/pitch.md)
- [Setup Guide](docs/setup.md)
- [AI Build Log](docs/ai-build-log.md)
- [Judging Hook](docs/judging-hook.md)
- [Credits](docs/credits.md)

---

Built for **HackIndia Vibe Coding Hackathon 2026** — India's largest AI & Web3 event.
