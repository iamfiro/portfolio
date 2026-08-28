import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
  AnalyticsEvent,
  getEngagementLevel,
  getPageCategory,
  trackEvent,
} from "@/shared/lib/analytics";

/**
 * 페이지 체류 시간 트래킹
 * - 라우트 변경 시 이전 페이지의 체류 시간 전송
 * - 탭 비활성화 시간 제외 (visibilitychange)
 * - 5초 미만은 bounce로 분류
 */
export function useTimeOnPage(): void {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const hiddenTimeRef = useRef(0);
  const hiddenStartRef = useRef<number | null>(null);

  // 탭 비활성화 시간 추적
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenStartRef.current = Date.now();
      } else if (hiddenStartRef.current) {
        hiddenTimeRef.current += Date.now() - hiddenStartRef.current;
        hiddenStartRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    startTimeRef.current = Date.now();
    hiddenTimeRef.current = 0;
    hiddenStartRef.current = null;

    return () => {
      const totalTime = Date.now() - startTimeRef.current;
      const activeTime = totalTime - hiddenTimeRef.current;
      const seconds = Math.round(activeTime / 1000);

      // 최소 1초 이상 체류한 경우만 전송
      if (seconds >= 1) {
        trackEvent(AnalyticsEvent.TIME_ON_PAGE, {
          time_seconds: seconds,
          page_path: currentPath,
          page_category: getPageCategory(currentPath),
          engagement_level: getEngagementLevel(seconds),
        });
      }
    };
  }, [location.pathname]);

  // beforeunload 시에도 전송 (페이지 이탈)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const totalTime = Date.now() - startTimeRef.current;
      const activeTime = totalTime - hiddenTimeRef.current;
      const seconds = Math.round(activeTime / 1000);

      if (seconds >= 1) {
        trackEvent(AnalyticsEvent.TIME_ON_PAGE, {
          time_seconds: seconds,
          page_path: location.pathname,
          page_category: getPageCategory(location.pathname),
          engagement_level: getEngagementLevel(seconds),
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname]);
}
