interface ReasonsListProps {
  reasons: string[];
}

export default function ReasonsList({ reasons }: ReasonsListProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Key insights</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {reasons.length === 0 ? (
          <li>No insights generated yet.</li>
        ) : (
          reasons.map((reason, index) => (
            <li key={`${reason}-${index}`} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              {reason}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
