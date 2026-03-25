export const dynamic = "force-dynamic";

import { getAnalytics } from "@/lib/analytics";
import StatCard from "@/components/analytics/StatCard";
import MomentumGauge from "@/components/analytics/MomentumGauge";
import FeaturePipeline from "@/components/analytics/FeaturePipeline";
import BuildHeatmap from "@/components/analytics/BuildHeatmap";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";
import CadenceStats from "@/components/analytics/CadenceStats";
import { CurrentlyBuilding, WhatsNext, RecentShipments } from "@/components/analytics/LiveFeeds";
import ProjectBreakdown from "@/components/analytics/ProjectBreakdown";
import FocusScore from "@/components/analytics/FocusScore";
import FeatureRatio from "@/components/analytics/FeatureRatio";
import TagCloud from "@/components/analytics/TagCloud";
import TechStackChart from "@/components/analytics/TechStackChart";
import ContentDepth from "@/components/analytics/ContentDepth";

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  const { overview } = data;

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      <p
        className="text-xs tracking-widest mb-2"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        ANALYTICS
      </p>
      <h1
        className="glow-line text-3xl font-bold mb-12"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: "var(--text-primary)",
        }}
      >
        Work Patterns
      </h1>

      {/* ── AT A GLANCE ──────────────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="at-a-glance-heading">
        <h2
          id="at-a-glance-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          AT A GLANCE
        </h2>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            value={overview.totalEntries}
            label="ENTRIES LOGGED"
            ariaLabel={`${overview.totalEntries} total entries logged`}
          />
          <StatCard
            value={overview.totalFeatures}
            label="FEATURES TRACKED"
            ariaLabel={`${overview.totalFeatures} total features tracked`}
          />
          <StatCard
            value={overview.totalWords.toLocaleString()}
            label="WORDS WRITTEN"
            ariaLabel={`${overview.totalWords.toLocaleString()} total words written`}
          />
          <StatCard
            value={overview.daysSinceLastEntry === 0 ? "TODAY" : `${overview.daysSinceLastEntry}D`}
            label="SINCE LAST ENTRY"
            ariaLabel={`Last entry was ${overview.daysSinceLastEntry === 0 ? "today" : `${overview.daysSinceLastEntry} days ago`}`}
          />
        </div>

        {/* Momentum gauge — accent, not co-primary */}
        <MomentumGauge score={overview.momentum} components={overview.momentumComponents} />
      </section>

      {/* ── FEATURE PIPELINE ─────────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="pipeline-heading">
        <h2
          id="pipeline-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          FEATURE PIPELINE
        </h2>
        <div className="max-w-2xl">
          <FeaturePipeline
            shipped={overview.shippedFeatures}
            inProgress={overview.inProgressFeatures}
            planned={overview.plannedFeatures}
            byProject={data.featuresByProject}
          />
        </div>
      </section>

      {/* ── WHEN ─────────────────────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="when-heading">
        <h2
          id="when-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          ACTIVITY
        </h2>

        {/* Build journal heatmap */}
        <div className="mb-10">
          <BuildHeatmap entryDates={data.entryDates} />
        </div>

        {/* Monthly bar chart */}
        <div className="mb-10">
          <p
            className="text-xs tracking-widest mb-4"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-muted)",
            }}
          >
            BY MONTH
          </p>
          <ActivityTimeline entriesByMonth={data.entriesByMonth} />
        </div>

        {/* Cadence stats */}
        <CadenceStats
          avgDaysBetweenEntries={data.cadence.avgDaysBetweenEntries}
          longestGapDays={data.cadence.longestGapDays}
          currentStreakDays={data.cadence.currentStreakDays}
          firstEntryDate={data.cadence.firstEntryDate}
        />
      </section>

      {/* ── WHAT'S HAPPENING ─────────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="whats-happening-heading">
        <h2
          id="whats-happening-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          WHAT&apos;S HAPPENING
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <CurrentlyBuilding items={data.currentlyBuilding} />
          <WhatsNext items={data.whatsNext} />
          <RecentShipments items={data.recentShipments} />
        </div>
      </section>

      {/* ── DEEP CUTS ────────────────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="deep-cuts-heading">
        <h2
          id="deep-cuts-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          BY PROJECT
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Project entry distribution */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              ENTRY DISTRIBUTION
            </p>
            <ProjectBreakdown entriesByProject={data.entriesByProject} />
          </div>

          {/* Focus score */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              FOCUS SCORE
            </p>
            <FocusScore
              focusScore={data.focusScore}
              focusLabel={data.focusLabel}
              totalEntries={data.overview.totalEntries}
              totalProjects={data.overview.totalProjects}
            />
          </div>

          {/* Feature vs entry ratio */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              FEATURES VS ENTRIES
            </p>
            <FeatureRatio featuresByProject={data.featuresByProject} />
          </div>
        </div>
      </section>

      {/* ── CONTENT & VOCABULARY ─────────────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="content-heading">
        <h2
          id="content-heading"
          className="glow-line text-xs tracking-widest mb-6"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          CONTENT &amp; VOCABULARY
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tag cloud */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              TAGS
            </p>
            <TagCloud tagFrequency={data.tagFrequency} />
          </div>

          {/* Tech stack */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              TECH STACK
            </p>
            <TechStackChart techStackFrequency={data.techStackFrequency} />
          </div>

          {/* Content depth */}
          <div>
            <p
              className="text-xs tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              CONTENT DEPTH
            </p>
            <ContentDepth
              totalWords={data.overview.totalWords}
              wordCountByEntry={data.wordCountByEntry}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
