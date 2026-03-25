export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjectFeatures } from "@/lib/projects";
import { getEntriesByProject, markdownToHtml } from "@/lib/entries";
import EntryCard from "@/components/EntryCard";
import FeatureList from "@/components/FeatureList";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_LABELS = {
  active: "ACTIVE",
  planned: "PLANNED",
  archived: "ARCHIVED",
} as const;

const STATUS_COLORS = {
  active: "var(--accent-secondary)",
  planned: "var(--accent)",
  archived: "var(--text-muted)",
} as const;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const [project, features, entries] = await Promise.all([
    getProject(slug),
    getProjectFeatures(slug),
    getEntriesByProject(slug),
  ]);

  if (!project) notFound();

  const descriptionHtml = project.description ? await markdownToHtml(project.description) : null;

  const shippedFeatures = features.filter((f) => f.status === "shipped");
  const inProgressFeatures = features.filter((f) => f.status === "in-progress");
  const plannedFeatures = features.filter((f) => f.status === "planned");

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      {/* Back link */}
      <Link
        href="/"
        className="text-xs tracking-widest transition-colors"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        ← HOME
      </Link>

      {/* Project header */}
      <div className="mt-8 mb-12">
        <p
          className="text-xs tracking-widest mb-2"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
          }}
        >
          PROJECT
        </p>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.icon && <span className="text-2xl leading-none">{project.icon}</span>}
            <h1
              className="glow-line text-3xl font-bold"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: "var(--text-primary)",
              }}
            >
              {project.displayName}
            </h1>
          </div>
          <span
            className="text-xs tracking-widest shrink-0 pt-1"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: STATUS_COLORS[project.status],
            }}
          >
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <p
          className="text-sm mt-5 max-w-prose"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--text-secondary)",
          }}
        >
          {project.tagline}
        </p>

        {/* Tech stack pills */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.url || project.repoUrl) && (
          <div className="flex gap-4 mt-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest transition-colors"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: "var(--accent)",
                }}
              >
                LIVE ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest transition-colors"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: "var(--text-secondary)",
                }}
              >
                REPO ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {descriptionHtml && (
        <section className="mb-12">
          <h2
            className="glow-line text-xs tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-secondary)",
            }}
          >
            ABOUT
          </h2>
          <div
            className="entry-content max-w-prose"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="mb-12">
          <h2
            className="glow-line text-xs tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-secondary)",
            }}
          >
            FEATURES
          </h2>
          <FeatureList
            shipped={shippedFeatures}
            inProgress={inProgressFeatures}
            planned={plannedFeatures}
          />
        </section>
      )}

      {/* Changelog */}
      {entries.length > 0 && (
        <section>
          <h2
            className="glow-line text-xs tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-secondary)",
            }}
          >
            CHANGELOG
          </h2>
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <EntryCard key={entry.slug} entry={entry} animationDelay={i * 50} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
