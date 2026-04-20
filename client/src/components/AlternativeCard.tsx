import type { Candidate } from '../lib/types';

interface AlternativeCardProps {
  alternative: Candidate;
}

export default function AlternativeCard({ alternative }: AlternativeCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{alternative.title}</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
          {alternative.score}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{alternative.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
          {alternative.assessment}
        </span>
        <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
          {alternative.dataSignal}
        </span>
      </div>
    </div>
  );
}
