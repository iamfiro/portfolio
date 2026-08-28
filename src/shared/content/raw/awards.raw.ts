import { loadMarkdownEntries } from "@/shared/utils/frontmatter.util";

const modules = import.meta.glob("/src/content/awards/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const rawAwards = loadMarkdownEntries(modules);
