# Sahayak AI - Setup Guide

## Prerequisites
- Node.js 18+ (recommended: 20+)
- npm, pnpm, or yarn
- Google AI API key (for Gemini)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd sahayak-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

## Environment Variables

Create `.env.local` with:

```
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Mode

The app includes a built-in demo mode with:
- 3 pre-loaded sample documents (scholarship, reimbursement, admission)
- 1 seeded applicant profile
- No API key required for demo mode

Click "Try Demo" on the landing page, then "Load Demo & Start".

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` in environment variables
4. Deploy

```bash
# Or using Vercel CLI
npx vercel
```

## Project Structure

```
src/
  app/           # Next.js App Router pages
    api/         # API routes (parse, chat, demo)
    documents/   # Document overview page
    profile/     # Applicant profile page
    eligibility/ # Eligibility results page
    checklist/   # Missing documents page
    chat/        # Ask Sahayak chat page
    final/       # Final readiness page
    workflow/    # AI workflow page (for judges)
    demo/        # Demo/upload page
  components/    # React components
    shared/      # Reusable components (navbar, step indicator, etc.)
    ui/          # shadcn/ui components
  lib/           # Core logic
    ai/          # AI integration, prompts, demo data
    parsing/     # PDF parsing, document detection
    eligibility/ # Eligibility engine
    checklist/   # Missing documents engine
    profile/     # Field completion assistant
    scoring/     # Readiness scoring
  types/         # TypeScript types and Zod schemas
docs/            # Documentation
```

## Troubleshooting

- **PDF parsing fails**: Ensure the PDF is not password-protected
- **AI responses slow**: First request may be slower due to cold start
- **Build errors**: Run `npm run lint` to check for issues
