import AlternativeCard from './AlternativeCard';
import type { Candidate } from '../lib/types';

interface AlternativesListProps {
  alternatives: Candidate[];
}

export default function AlternativesList({ alternatives }: AlternativesListProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Candidate results</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {alternatives.length === 0 ? (
          <p className="text-sm text-slate-600">No candidate items have been submitted yet.</p>
        ) : (
          alternatives.map((alternative) => (
            <AlternativeCard key={alternative.id} alternative={alternative} />
          ))
        )}
      </div>
    </section>
  );
}
