interface CadenceStatsProps {
  avgDaysBetweenEntries: number;
  longestGapDays: number;
  currentStreakDays: number;
  firstEntryDate: string | null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

interface InlineStatProps {
  label: string;
  value: string;
}

function InlineStat({ label, value }: InlineStatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <span
        className="text-lg font-bold"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: "var(--text-secondary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function CadenceStats({
  avgDaysBetweenEntries,
  longestGapDays,
  currentStreakDays,
  firstEntryDate,
}: CadenceStatsProps) {
  if (!firstEntryDate) return null;

  return (
    <div className="flex flex-wrap gap-8" aria-label="Entry cadence statistics">
      <InlineStat
        label="AVG DAYS BETWEEN ENTRIES"
        value={avgDaysBetweenEntries === 0 ? "—" : `${avgDaysBetweenEntries}D`}
      />
      <InlineStat label="LONGEST GAP" value={longestGapDays === 0 ? "—" : `${longestGapDays}D`} />
      <InlineStat
        label="ACTIVE STREAK"
        value={currentStreakDays === 0 ? "—" : `${currentStreakDays}D`}
      />
      <InlineStat label="ACTIVE SINCE" value={formatDate(firstEntryDate)} />
    </div>
  );
}
