import type { TocItem, TocLinePoint } from "./toc.type";

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
  ).filter((el) => !el.closest("[data-footnotes]")); // 각주 라벨은 목차에서 제외
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

// 깊이가 바뀌는 지점에서 사선이 차지할 세로 길이(px)
const BEND = 6;

/**
 * 목차 항목들의 x 위치와 세로 범위로 하나의 연속된 SVG path 를 만든다.
 * 깊이가 바뀌는 항목 사이는 사선으로 이어져 선이 자연스럽게 꺾인다.
 */
export function buildTocPath(points: TocLinePoint[]): string {
  return points
    .flatMap((point, i) => {
      const prev = points[i - 1];
      const next = points[i + 1];
      const start = prev && prev.x !== point.x ? point.top + BEND : point.top;
      const end =
        next && next.x !== point.x ? point.bottom - BEND : point.bottom;
      return [`${point.x} ${start}`, `${point.x} ${end}`];
    })
    .map((coord, i) => `${i === 0 ? "M" : "L"}${coord}`)
    .join(" ");
}
