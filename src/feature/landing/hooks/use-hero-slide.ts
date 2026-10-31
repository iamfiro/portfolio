import { useEffect, useState } from "react";

interface Options {
  count: number;
  interval?: number;
}

/** 히어로 이미지 슬라이드의 현재 인덱스를 일정 간격으로 순환시킨다. */
export function useHeroSlide({ count, interval = 3200 }: Options) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, interval);

    return () => window.clearInterval(timer);
  }, [count, interval]);

  return index;
}
