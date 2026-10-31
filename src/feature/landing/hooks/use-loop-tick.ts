import { useInView, useReducedMotion } from "framer-motion";
import { type RefObject, useEffect, useState } from "react";

/**
 * 대상이 화면에 보이는 동안만 interval(ms)마다 0 → count-1을 돌며 박자를 센다.
 * 화면 밖에선 멈추고, 동작 줄이기 사용자에겐 마지막 박자에 고정해 완성된 장면을 보여준다.
 */
export function useLoopTick<T extends HTMLElement>(
  targetRef: RefObject<T>,
  count: number,
  interval: number,
) {
  const isInView = useInView(targetRef, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const timer = window.setInterval(
      () => setTick((current) => (current + 1) % count),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [count, interval, isInView, reduceMotion]);

  return {
    tick: reduceMotion ? count - 1 : tick,
    isInView: isInView || !!reduceMotion,
  };
}
