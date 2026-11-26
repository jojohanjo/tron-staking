export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <div className="muted text-xs font-semibold uppercase tracking-wider">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint ? <div className="muted mt-2 text-xs">{hint}</div> : null}
    </div>
  );
}
