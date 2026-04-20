# evan-buchanan-precisely-hackathon

Starter template for building AI-powered apps, agents, skills, or MCP-connected workflows on top of Precisely-style data and API experiences. The scaffold is intentionally general so you can adapt it quickly once the hackathon direction becomes clear.

## What is included

- React + Vite client for collecting a prompt, optional context, and candidate items
- Express + TypeScript server with a sample analysis pipeline
- Neutral sample scoring logic that produces:
  - overall analysis score
  - confidence score
  - status label
  - recommended candidate
  - explanation insights
- Optional OpenAI summary generation when `OPENAI_API_KEY` is present

## Project structure

- `client/`: frontend starter app
- `server/`: backend API and evaluation services
- `server/src/services/scoring.ts`: starter scoring heuristics for prototyping
- `server/src/services/llm.ts`: LLM-enhanced summary layer with fallback behavior

## Quick start

```bash
npm run install:all
cp server/.env.example server/.env
npm run build
```

Then run the apps in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

Client runs through Vite and proxies `/api` calls to the backend on `http://localhost:4000`.

## API shape

`POST /api/analyze`

Example request:

```json
{
  "prompt": "Which asset should we prototype first for Precisely Lab?",
  "context": "Focus on explainability, developer usefulness, and strong demo potential.",
  "candidates": [
    "Geocoding agent",
    "Fraud detection scout",
    "Real estate intelligence app"
  ]
}
```

Example response:

```json
{
  "score": 79,
  "confidence": 86,
  "status": "High",
  "analyzedContext": "Focus on explainability, developer usefulness, and strong demo potential.",
  "recommendedCandidateId": "alt-2",
  "summary": "The strongest starting point appears to be...",
  "insights": [
    "Top candidate...",
    "Context...",
    "Confidence is..."
  ],
  "candidates": [
    {
      "id": "alt-1",
      "title": "Geocoding agent",
      "description": "Candidate alternative being evaluated.",
      "score": 82,
      "assessment": "High signal",
      "dataSignal": "Strong match to provided context"
    }
  ]
}
```

## Good next steps for the hackathon

- Add a real domain adapter for geocoding, fraud, real estate, logistics, or catalog workflows
- Replace the sample heuristics with API-backed scoring or tool-calling logic
- Introduce manifest-driven asset metadata for apps, agents, skills, or MCP actions
- Add vertical-specific criteria such as coverage, risk, cost, trust, or data freshness
- Persist runs so you can compare scenarios and show decision traces during demos
