import type { RefObject } from "react";
import { useEffect, useState } from "react";

import type { TocItem } from "../components/table-of-contents/toc.type";
import { collectHeadings } from "../components/table-of-contents/toc.util";

// 화면 상단에서 이 거리(px)를 지난 헤딩을 "읽는 중"으로 본다 (고정 헤더 높이 + 여유)
const SPY_OFFSET = 140;

export function useTableOfContents(
  contentRef: RefObject<HTMLElement | null>,
  content: string,
) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const container = contentRef.current;
    if (!container || !content) return;

    const collected = collectHeadings(container);
    setItems(collected);

    const headingEls = collected
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    let frame = 0;

    // 상단 기준선을 지난 마지막 헤딩을 활성화하고, 페이지 끝에서는 마지막 헤딩을 활성화한다
    const measure = () => {
      frame = 0;

      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      let current = headingEls[0].id;
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top <= SPY_OFFSET) current = el.id;
      }

      setActiveId(atBottom ? headingEls[headingEls.length - 1].id : current);
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return { items, activeId };
}
