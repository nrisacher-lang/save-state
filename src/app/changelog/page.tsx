import { getAllEntries, getProjects } from "@/lib/entries";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";

export default async function ChangelogPage() {
  const [entries, projects] = await Promise.all([getAllEntries(), getProjects()]);

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      <Header entryCount={entries.length} />
      <EntryList entries={entries} projects={projects} />
    </main>
  );
}
