import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get("project");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

  let entries = await getAllEntries();

  if (project) {
    entries = entries.filter((e) => e.frontmatter.project === project);
  }

  const data = entries.slice(0, limit).map((e) => ({
    slug: e.slug,
    date: e.frontmatter.date,
    project: e.frontmatter.project,
    session: e.frontmatter.session,
    tags: e.frontmatter.tags,
    type: e.frontmatter.type,
  }));

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  });
}
