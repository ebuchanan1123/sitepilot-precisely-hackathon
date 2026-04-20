import type { AnalysisRequest, AnalysisResponse } from './types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function runAnalysis(payload: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await fetch(`${apiBaseUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorPayload?.message ?? 'Unable to evaluate decision.');
  }

  return response.json();
}
