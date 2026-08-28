import { loadMarkdownEntries } from "@/shared/utils/frontmatter.util";

const modules = import.meta.glob("/src/content/projects/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const rawProjects = loadMarkdownEntries(modules);
