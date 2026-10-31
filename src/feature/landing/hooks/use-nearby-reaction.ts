import { type RefObject, useEffect, useRef, useState } from "react";

import type { PointerEventSpot } from "./use-pointer-activity";

/** 사건이 요소 가까이서 일어났으면 duration(ms) 동안 true를 돌려준다 */
export function useNearbyReaction(
  ref: RefObject<Element | null>,
  spot: PointerEventSpot | null,
  duration: number,
) {
  const [active, setActive] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const element = ref.current;
    if (!spot || !element) return;

    const rect = element.getBoundingClientRect();
    const distance = Math.hypot(
      spot.x - (rect.left + rect.width / 2),
      spot.y - (rect.top + rect.height / 2),
    );
    if (distance - rect.width / 2 > spot.margin) return;

    // 반응 중에 또 일어나면 그때부터 다시 센다
    setActive(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(false), duration);
  }, [ref, spot, duration]);

  return active;
}
