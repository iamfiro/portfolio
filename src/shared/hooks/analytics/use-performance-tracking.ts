import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/shared/lib/analytics";

/**
 * Web Vitals 성능 메트릭 트래킹
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - 페이지 로드 시간
 */
export function usePerformanceTracking(): void {
  useEffect(() => {
    // Performance Observer로 FCP 측정
    if ("PerformanceObserver" in window) {
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          for (const entry of entries) {
            if (entry.name === "first-contentful-paint") {
              trackEvent(AnalyticsEvent.FIRST_CONTENTFUL_PAINT, {
                metric_name: "FCP",
                metric_value: Math.round(entry.startTime),
                page_path: window.location.pathname,
              });
              fcpObserver.disconnect();
            }
          }
        });

        fcpObserver.observe({ type: "paint", buffered: true });
      } catch {
        // PerformanceObserver 미지원 환경 무시
      }
    }

    // 페이지 로드 완료 시 로드 시간 측정
    const handleLoad = () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;

        if (navigation) {
          trackEvent(AnalyticsEvent.PAGE_LOAD_TIME, {
            metric_name: "page_load",
            metric_value: Math.round(
              navigation.loadEventEnd - navigation.startTime,
            ),
            page_path: window.location.pathname,
          });
        }
      }, 0);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);
}
