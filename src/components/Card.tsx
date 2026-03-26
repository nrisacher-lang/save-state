interface CardProps {
  projectId?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ship" | "debut";
}

export default function Card({
  projectId,
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const borderColor = projectId ? `var(--project-${projectId})` : "var(--border)";
  const isElevated = variant === "ship" || variant === "debut";
  const paddingClass = variant === "debut" ? "p-6" : "p-5";
  const hoverClass = isElevated ? "" : "hover:bg-bg-elevated";
  const variantClass = isElevated ? `card-${variant}` : "";

  const style = isElevated
    ? ({
        "--card-project-color": projectId ? `var(--project-${projectId})` : "var(--border)",
      } as React.CSSProperties)
    : ({
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${borderColor}`,
      } as React.CSSProperties);

  return (
    <div
      className={`rounded-xl ${paddingClass} transition-colors duration-150 ${hoverClass} ${variantClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
