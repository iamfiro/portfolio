import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
  AnalyticsEvent,
  getPageCategory,
  type ScrollDepthParams,
  trackEvent,
} from "@/shared/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100] as const;

/**
 * 스크롤 깊이 트래킹
 * - 25%, 50%, 75%, 90%, 100% 도달 시 이벤트 전송
 * - 페이지 변경 시 자동 리셋
 * - passive 이벤트로 성능 영향 최소화
 */
export function useScrollDepth(): void {
  const location = useLocation();
  const trackedThresholds = useRef(new Set<number>());

  const resetThresholds = useCallback(() => {
    trackedThresholds.current.clear();
  }, []);

  useEffect(() => {
    resetThresholds();
  }, [location.pathname, resetThresholds]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        if (scrollHeight <= 0) {
          ticking = false;
          return;
        }

        const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

        for (const threshold of SCROLL_THRESHOLDS) {
          if (
            scrollPercent >= threshold &&
            !trackedThresholds.current.has(threshold)
          ) {
            trackedThresholds.current.add(threshold);

            trackEvent(AnalyticsEvent.SCROLL_DEPTH, {
              scroll_percentage:
                threshold as ScrollDepthParams["scroll_percentage"],
              page_path: location.pathname,
              page_category: getPageCategory(location.pathname),
            });
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
}
