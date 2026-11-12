import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

import type { TocLinePoint } from "../components/table-of-contents/toc.type";
import { buildTocPath } from "../components/table-of-contents/toc.util";

// 깊이 1단계당 선이 오른쪽으로 이동하는 거리 (style.module.scss 의 $spacing-12 와 맞춘다)
export const TOC_INDENT = 12;
const STROKE_WIDTH = 2;

interface TocLine {
  path: string;
  width: number;
  height: number;
  thumb: { top: number; height: number } | null;
}

const EMPTY_LINE: TocLine = { path: "", width: 0, height: 0, thumb: null };

/**
 * 목차 항목의 실제 위치를 측정해 깊이에 따라 꺾이는 선(path)과
 * 활성 항목을 가리키는 thumb 의 위치를 계산한다.
 */
export function useTocLine(
  listRef: RefObject<HTMLElement | null>,
  deps: unknown[],
): TocLine {
  const [line, setLine] = useState<TocLine>(EMPTY_LINE);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const links = Array.from(
        list.querySelectorAll<HTMLElement>("[data-depth]"),
      );
      if (links.length === 0) return setLine(EMPTY_LINE);

      const points: TocLinePoint[] = links.map((link) => ({
        x: Number(link.dataset.depth) * TOC_INDENT + STROKE_WIDTH / 2,
        top: link.offsetTop,
        bottom: link.offsetTop + link.offsetHeight,
      }));

      const active = list.querySelector<HTMLElement>("[aria-current]");

      setLine({
        path: buildTocPath(points),
        width: Math.max(...points.map((p) => p.x)) + STROKE_WIDTH / 2,
        height: list.offsetHeight,
        thumb: active
          ? { top: active.offsetTop, height: active.offsetHeight }
          : null,
      });
    };

    measure();

    // 폰트 로딩·리사이즈로 줄바꿈이 바뀌면 다시 측정
    const observer = new ResizeObserver(measure);
    observer.observe(list);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return line;
}
