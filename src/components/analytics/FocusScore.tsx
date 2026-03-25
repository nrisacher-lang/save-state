interface FocusScoreProps {
  focusScore: number;
  focusLabel: string;
  totalEntries: number;
  totalProjects: number;
}

export default function FocusScore({
  focusScore,
  focusLabel,
  totalEntries,
  totalProjects,
}: FocusScoreProps) {
  if (totalEntries === 0) return null;

  return (
    <div className="flex flex-col gap-1" aria-label={`Focus score: ${focusScore}, ${focusLabel}`}>
      <span
        className="text-3xl font-bold leading-none"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: "var(--text-primary)",
        }}
      >
        {focusScore.toFixed(2)}
      </span>
      <span
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--accent)",
        }}
      >
        {focusLabel}
      </span>
      <p
        className="text-xs mt-1"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          color: "var(--text-muted)",
        }}
      >
        Based on {totalEntries} {totalEntries === 1 ? "entry" : "entries"} across {totalProjects}{" "}
        {totalProjects === 1 ? "project" : "projects"}. Herfindahl index — 1.0 means all work in one
        project, {(1 / totalProjects).toFixed(2)} means perfectly even.
      </p>
    </div>
  );
}
