interface CardProps {
  projectId?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ projectId, children, className = "" }: CardProps) {
  const borderColor = projectId ? `var(--project-${projectId})` : "var(--border)";

  return (
    <div
      className={`rounded-xl p-5 transition-colors duration-150 hover:bg-bg-elevated ${className}`}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {children}
    </div>
  );
}
