export default function AnalyticsPage() {
  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      <p
        className="text-xs tracking-widest mb-4"
        style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--text-muted)" }}
      >
        ANALYTICS
      </p>
      <h1
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        Work Patterns
      </h1>
      <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}>
        Analytics dashboard — coming in Step 5.
      </p>
    </main>
  );
}
