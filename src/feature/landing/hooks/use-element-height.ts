import { useLayoutEffect, useState } from "react";

/** callback ref로 붙인 요소의 높이를 ResizeObserver로 추적한다. */
export function useElementHeight<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0].blockSize);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return [setNode, height] as const;
}
