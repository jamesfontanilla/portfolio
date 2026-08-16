import type { Project } from "@/lib/types";

export function slugifyProjectTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProjectSlug(project: Project) {
  return project.slug || slugifyProjectTitle(project.title);
}
