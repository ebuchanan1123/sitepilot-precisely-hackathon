import OpenAI from 'openai';
import { evaluateAlternatives } from './scoring.js';
import { parseAlternatives } from './alternatives.js';

export async function runAnalysis(prompt: string, context: string, candidates: string[]) {
  const parsedAlternatives = parseAlternatives(candidates);
  const fallbackEvaluation = evaluateAlternatives(prompt, context, parsedAlternatives);
  let summary = fallbackEvaluation.summary;

  if (process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: `Summarize the following AI agent analysis in 2-3 sentences:
Prompt: ${prompt}
Context: ${context || 'No additional context provided'}
Candidates:
${fallbackEvaluation.enrichedCandidates.map((alt) => `- ${alt.title} | score ${alt.score} | ${alt.dataSignal}`).join('\n')}`,
      });

      if (typeof response.output_text === 'string' && response.output_text.trim().length > 0) {
        summary = response.output_text.trim();
      }
    } catch (error) {
      console.warn('OpenAI request failed, using fallback summary.', error);
    }
  }

  return {
    score: fallbackEvaluation.overallScore,
    confidence: fallbackEvaluation.confidence,
    status: fallbackEvaluation.status,
    analyzedContext: context || 'No additional context provided',
    recommendedCandidateId: fallbackEvaluation.recommendedCandidateId,
    summary,
    insights: fallbackEvaluation.insights,
    candidates: fallbackEvaluation.enrichedCandidates,
  };
}
