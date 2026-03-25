interface StatCardProps {
  value: number | string;
  label: string;
  ariaLabel: string;
}

export default function StatCard({ value, label, ariaLabel }: StatCardProps) {
  return (
    <div className="card-spark-shell p-5 flex flex-col gap-1" aria-label={ariaLabel} role="figure">
      <span
        className="text-3xl font-bold leading-none"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: "var(--text-primary)",
        }}
      >
        {value}
      </span>
      <span
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
