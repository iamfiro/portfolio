import type { TocItem } from "./toc.type";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .replace(/--+/g, "-");
}

export function collectHeadings(container: HTMLElement): TocItem[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>("h1, h2, h3"),
  );
  const slugCount = new Map<string, number>();
  const items: TocItem[] = [];

  for (const el of elements) {
    const level = parseInt(el.tagName[1], 10) as 1 | 2 | 3;
    const text = el.textContent?.trim() ?? "";

    if (!el.id) {
      const base = slugify(text) || `heading-${items.length}`;
      const count = slugCount.get(base) ?? 0;
      slugCount.set(base, count + 1);
      el.id = count === 0 ? base : `${base}-${count + 1}`;
    }

    items.push({ id: el.id, text, level });
  }

  return items;
}
