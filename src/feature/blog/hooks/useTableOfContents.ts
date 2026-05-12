import type { RefObject } from "react";
import { useEffect, useState } from "react";

import type { TocItem } from "../components/table-of-contents/toc.type";
import { collectHeadings } from "../components/table-of-contents/toc.util";

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

    if (collected.length === 0) return;

    const headingEls = collected
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    headingEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return { items, activeId };
}
