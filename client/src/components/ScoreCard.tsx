import type { AnalysisResponse } from '../lib/types';

interface ScoreCardProps {
  result: AnalysisResponse;
}

export default function ScoreCard({ result }: ScoreCardProps) {
  const recommended = result.candidates.find((candidate) => candidate.id === result.recommendedCandidateId);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Analysis score</h2>
          <p className="mt-2 text-5xl font-bold text-sky-600">{result.score}</p>
        </div>

        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{result.confidence}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{result.status}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{result.summary}</p>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Analyzed context</p>
          <p className="mt-2 font-medium text-slate-900">{result.analyzedContext}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top candidate</p>
          <p className="mt-2 font-medium text-slate-900">{recommended?.title ?? 'No recommendation yet'}</p>
        </div>
      </div>
    </section>
  );
}
