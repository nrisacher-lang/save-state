import Card from "./Card";
import type { Entry } from "@/lib/types";

interface EntryCardProps {
  entry: Entry;
  animationDelay?: number;
  projectDisplayName?: string;
}

export default function EntryCard({
  entry,
  animationDelay = 0,
  projectDisplayName,
}: EntryCardProps) {
  const { frontmatter, content } = entry;
  const type = frontmatter.type ?? "session";
  const displayName = projectDisplayName ?? frontmatter.project;
  const isShip = type === "ship";
  const isDebut = type === "debut";
  const isElevated = isShip || isDebut;

  return (
    <div className="animate-entry" style={{ animationDelay: `${animationDelay}ms` }}>
      <Card projectId={frontmatter.project} variant={isElevated ? type : "default"}>
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              letterSpacing: "0.06em",
              background: "var(--bg-elevated)",
              color: `var(--project-${frontmatter.project})`,
              border: `1px solid var(--project-${frontmatter.project})`,
            }}
          >
            {displayName.toUpperCase()}
          </span>

          {isShip && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.06em",
                background: "var(--bg-elevated)",
                color: "var(--accent-secondary)",
                border: "1px solid var(--accent-secondary)",
              }}
            >
              SHIPPED
            </span>
          )}

          {isDebut && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.06em",
                background: "var(--bg-elevated)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              NEW PROJECT
            </span>
          )}

          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.04em",
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Session title — JetBrains Mono 700 for ship/debut, DM Sans for session */}
        <h2
          className="text-base mb-3"
          style={
            isElevated
              ? {
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }
              : {
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }
          }
        >
          {frontmatter.session}
        </h2>

        {/* Rendered markdown */}
        <div className="entry-content" dangerouslySetInnerHTML={{ __html: content }} />
      </Card>
    </div>
  );
}
