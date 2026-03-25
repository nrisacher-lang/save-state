interface HeroSectionProps {
  projectCount: number;
  entryCount: number;
}

export default function HeroSection({ projectCount, entryCount }: HeroSectionProps) {
  return (
    <section className="mb-14">
      <p
        className="text-xs tracking-widest mb-2"
        style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--accent)" }}
      >
        UNDERSTORY LABS
      </p>
      <h1
        className="glow-line text-3xl font-bold"
        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--text-primary)" }}
      >
        Save State
      </h1>
      <p
        className="text-sm mt-5"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-secondary)" }}
      >
        {projectCount} active {projectCount === 1 ? "project" : "projects"} · {entryCount}{" "}
        {entryCount === 1 ? "entry" : "entries"} logged · work in motion.
      </p>
    </section>
  );
}
