import type { RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { ProcessLayout } from "@/feature/landing/components/process/process.type";
import { measureRect } from "@/feature/landing/components/process/process.util";

/**
 * 문장 속 빈 칸과 덱 자리의 위치를 섹션 기준으로 잰다.
 * 칸 요소는 `slotRefs` 배열에 인덱스대로, 덱 자리는 `deckRef`에 등록한다.
 */
export function useProcessLayout(containerRef: RefObject<HTMLElement | null>) {
  const slotRefs = useRef<(HTMLElement | null)[]>([]);
  const deckRef = useRef<HTMLElement | null>(null);
  const [layout, setLayout] = useState<ProcessLayout | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const deck = deckRef.current;
      if (!deck) return;
      const deckRect = measureRect(deck, container);

      const toRects = (elements: (HTMLElement | null)[]) =>
        elements.flatMap((element) =>
          element ? [measureRect(element, container)] : [],
        );

      setLayout((previous) => ({
        slots: toRects(slotRefs.current),
        deck: {
          x: deckRect.x + deck.offsetWidth / 2,
          y: deckRect.y + deck.offsetHeight / 2,
        },
        version: (previous?.version ?? 0) + 1,
      }));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // 웹폰트가 늦게 붙으면 문장 줄바꿈이 바뀌어 칸 위치가 달라진다
    document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [containerRef]);

  return { layout, slotRefs, deckRef };
}
