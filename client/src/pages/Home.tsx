import { useState } from 'react';
import InputForm from '../components/InputForm';
import ScoreCard from '../components/ScoreCard';
import ReasonsList from '../components/ReasonsList';
import AlternativesList from '../components/AlternativesList';
import { runAnalysis } from '../lib/api';
import type { AnalysisResponse } from '../lib/types';

export default function Home() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (prompt: string, context: string, candidates: string[]) => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await runAnalysis({ prompt, context, candidates });
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'Unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Precisely Lab starter</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Start from a flexible AI agent scaffold.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Use this template to prototype AI-powered apps, agents, skills, or MCP-backed workflows with a neutral
            prompt, optional context, confidence scoring, explainable outputs, and ranked candidate results.
          </p>
        </header>

        <InputForm onSubmit={handleSubmit} />

        {isLoading && (
          <div className="rounded-xl bg-slate-50 p-6 text-slate-700 shadow-sm">Running sample analysis...</div>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
        )}

        {result && (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <ScoreCard result={result} />
              <ReasonsList reasons={result.insights} />
            </div>
            <AlternativesList alternatives={result.candidates} />
          </div>
        )}
      </div>
    </main>
  );
}
