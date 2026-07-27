import { getAllEntries, getProjects } from "@/lib/entries";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";

// This page reads projects from Supabase. Without this, Next.js tries to
// prerender it statically at build time — which hits Supabase during the
// Vercel build and fails. Force per-request rendering instead.
export const dynamic = "force-dynamic";

export default async function ChangelogPage() {
  const [entries, projects] = await Promise.all([getAllEntries(), getProjects()]);

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      <Header entryCount={entries.length} />
      <EntryList entries={entries} projects={projects} />
    </main>
  );
}
