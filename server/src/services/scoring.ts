import type { AlternativeItem } from './alternatives.js';

export interface DecisionMetrics {
  overallScore: number;
  confidence: number;
  status: 'High' | 'Medium' | 'Low';
  insights: string[];
  summary: string;
  recommendedCandidateId: string | null;
  enrichedCandidates: AlternativeItem[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildContextOverlapScore(context: string, alternative: AlternativeItem): number {
  if (!context.trim()) {
    return 8;
  }

  const contextTokens = new Set(tokenize(context));
  const alternativeTokens = tokenize(`${alternative.title} ${alternative.description}`);
  const overlapCount = alternativeTokens.filter((token) => contextTokens.has(token)).length;

  if (overlapCount >= 2) {
    return 32;
  }

  if (overlapCount === 1) {
    return 20;
  }

  return 6;
}

function buildKeywordSignalScore(question: string, alternative: AlternativeItem): number {
  const promptTokens = new Set(tokenize(question));
  const alternativeTokens = tokenize(`${alternative.title} ${alternative.description}`);
  const matchCount = alternativeTokens.filter((token) => promptTokens.has(token)).length;

  return Math.min(22, 10 + matchCount * 4);
}

function buildSignalStrengthScore(alternative: AlternativeItem): number {
  const text = normalize(`${alternative.title} ${alternative.description}`);
  const positiveSignals = ['agent', 'skill', 'api', 'automation', 'verified', 'trusted', 'realtime', 'coverage'];
  const cautionSignals = ['manual', 'legacy', 'temporary', 'partial', 'experimental'];

  const positives = positiveSignals.filter((signal) => text.includes(signal)).length;
  const cautions = cautionSignals.filter((signal) => text.includes(signal)).length;

  return Math.max(8, Math.min(24, 14 + positives * 4 - cautions * 3));
}

function toAssessment(score: number): 'High signal' | 'Moderate signal' | 'Needs review' {
  if (score >= 78) {
    return 'High signal';
  }

  if (score >= 60) {
    return 'Moderate signal';
  }

  return 'Needs review';
}

function buildDataSignal(context: string, score: number): string {
  if (!context.trim()) {
    return 'No additional context provided';
  }

  if (score >= 28) {
    return 'Strong match to provided context';
  }

  if (score >= 18) {
    return 'Partial match to provided context';
  }

  return 'Weak match to provided context';
}

export function evaluateAlternatives(prompt: string, context: string, alternatives: AlternativeItem[]): DecisionMetrics {
  const enrichedCandidates = alternatives.map((alternative) => {
    const contextScore = buildContextOverlapScore(context, alternative);
    const keywordScore = buildKeywordSignalScore(prompt, alternative);
    const signalStrengthScore = buildSignalStrengthScore(alternative);
    const score = Math.min(100, 28 + contextScore + keywordScore + signalStrengthScore);

    return {
      ...alternative,
      score,
      assessment: toAssessment(score),
      dataSignal: buildDataSignal(context, contextScore),
    };
  });

  const sortedAlternatives = [...enrichedCandidates].sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
  const topScore = sortedAlternatives[0]?.score ?? 0;
  const secondScore = sortedAlternatives[1]?.score ?? 0;
  const scoreGap = Math.max(0, topScore - secondScore);
  const overallScore = Math.round(
    enrichedCandidates.reduce((sum, alternative) => sum + (alternative.score ?? 0), 0) /
      Math.max(enrichedCandidates.length, 1),
  );
  const confidence = Math.min(98, Math.max(52, Math.round(topScore * 0.65 + scoreGap * 1.7)));
  const status: 'High' | 'Medium' | 'Low' =
    confidence >= 82 ? 'High' : confidence >= 68 ? 'Medium' : 'Low';
  const recommendedAlternative = sortedAlternatives[0] ?? null;

  const insights = [
    `Top candidate: ${recommendedAlternative?.title ?? 'N/A'} scored best across prompt relevance and signal strength.`,
    context.trim()
      ? `Context for this run was "${context.trim()}", which the sample engine used to reward semantic alignment.`
      : 'No extra context was provided, so the sample engine relied more heavily on generic signal strength.',
    `Confidence is ${confidence}% because the spread between the strongest and next-best candidate was ${scoreGap} points.`,
  ];

  const summary = recommendedAlternative
    ? `${recommendedAlternative.title} appears to be the strongest starting point for "${prompt}" with ${confidence}% confidence.`
    : `No recommendation could be generated for "${prompt}".`;

  return {
    overallScore,
    confidence,
    status,
    insights,
    summary,
    recommendedCandidateId: recommendedAlternative?.id ?? null,
    enrichedCandidates,
  };
}
