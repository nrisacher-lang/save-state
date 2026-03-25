interface MomentumGaugeProps {
  score: number;
  components: {
    recencyDays: number;
    recentShipCount: number;
    activeProjectCount: number;
  };
}

function getMomentumColor(score: number): string {
  if (score >= 70) return "var(--accent-secondary)"; // green — high momentum
  if (score >= 30) return "var(--accent)"; // amber — moderate
  return "var(--text-muted)"; // muted — low
}

export default function MomentumGauge({ score, components }: MomentumGaugeProps) {
  const color = getMomentumColor(score);

  return (
    <div
      className="flex flex-col gap-2"
      aria-label={`Portfolio pulse score: ${score} out of 100`}
      role="figure"
    >
      <p
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        PORTFOLIO PULSE
      </p>

      <span
        className="text-5xl font-bold leading-none"
        style={{ fontFamily: "var(--font-jetbrains), monospace", color }}
      >
        {score}
      </span>

      {/* Formula components — transparency for visitors */}
      <p
        className="text-xs"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          color: "var(--text-muted)",
        }}
      >
        Last entry:{" "}
        {components.recencyDays === 0
          ? "today"
          : components.recencyDays === 1
            ? "1 day ago"
            : `${components.recencyDays}d ago`}{" "}
        · Shipped this month: {components.recentShipCount} · Active projects:{" "}
        {components.activeProjectCount}
      </p>
    </div>
  );
}
