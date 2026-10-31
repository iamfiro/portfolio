import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import type { TrailParticle } from "@/feature/landing/components/cursor-trail/cursor-trail.type";
import {
  createTrailParticle,
  isOverFooter,
  isOverHero,
  isOverTrailOff,
  shouldSpawnTrail,
} from "@/feature/landing/components/cursor-trail/cursor-trail.util";

interface Options {
  /** 동시에 화면에 남길 수 있는 최대 버블 수 */
  maxCount?: number;
}

/** 마우스가 지나간 자리에 버블을 찍고, 애니메이션이 끝난 버블을 걷어낸다. */
export function useCursorTrail({ maxCount = 28 }: Options = {}) {
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<TrailParticle[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    let nextId = 0;
    let last: { x: number; y: number; time: number } | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const { clientX: x, clientY: y } = event;
      const now = performance.now();

      // 히어로·푸터·꺼 둔 영역 위에서는 찍지 않고, 기준점도 갱신하지 않아 본문 진입 즉시 찍힌다
      if (isOverHero(y) || isOverFooter(y) || isOverTrailOff(event.target)) {
        last = null;
        return;
      }

      if (last) {
        const distance = Math.hypot(x - last.x, y - last.y);
        if (!shouldSpawnTrail(distance, now - last.time)) return;
      }

      last = { x, y, time: now };
      const particle = createTrailParticle(nextId++, x, y);
      setParticles((prev) => [...prev, particle].slice(-maxCount));
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [maxCount, reducedMotion]);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id));
  }, []);

  return { particles, removeParticle };
}
