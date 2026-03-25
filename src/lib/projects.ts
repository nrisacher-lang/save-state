import { supabase } from "./supabase";
import type { Project, Feature } from "./types";

// Map Supabase snake_case row → TypeScript camelCase interface
function mapProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    displayName: row.display_name as string,
    tagline: row.tagline as string,
    description: row.description as string,
    techStack: (row.tech_stack as string[]) ?? [],
    status: row.status as Project["status"],
    color: row.color as string,
    url: (row.url as string) ?? null,
    repoUrl: (row.repo_url as string) ?? null,
    icon: (row.icon as string) ?? null,
    sortOrder: row.sort_order as number,
  };
}

function mapFeature(row: Record<string, unknown>): Feature {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    status: row.status as Feature["status"],
    shippedDate: (row.shipped_date as string) ?? null,
    sortOrder: row.sort_order as number,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data ?? []).map(mapProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", slug).single();

  if (error) {
    // PostgREST returns PGRST116 when no rows match — that's a 404, not an error
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch project "${slug}": ${error.message}`);
  }

  return data ? mapProject(data) : null;
}

export async function getProjectFeatures(projectId: string): Promise<Feature[]> {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to fetch features for "${projectId}": ${error.message}`);
  return (data ?? []).map(mapFeature);
}
