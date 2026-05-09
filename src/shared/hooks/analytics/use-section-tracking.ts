import { useEffect, useRef } from "react";

import { AnalyticsEvent, trackEvent } from "@/shared/lib/analytics";

/**
 * IntersectionObserver 기반 섹션 노출 트래킹
 * - 뷰포트에 50% 이상 노출 시 이벤트 전송
 * - 각 섹션당 한 번만 전송 (세션 내)
 * - 노출 지속 시간도 함께 기록
 *
 * 사용법:
 * <section data-section="hero" data-section-index="0">...</section>
 * <section data-section="about" data-section-index="1">...</section>
 */
export function useSectionTracking(): void {
  const trackedSections = useRef(new Set<string>());
  const visibleStartTimes = useRef(new Map<string, number>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const sectionName = element.dataset.section;
          const sectionIndex = Number(element.dataset.sectionIndex ?? 0);

          if (!sectionName) continue;

          if (entry.isIntersecting) {
            // 노출 시작 시간 기록
            if (!visibleStartTimes.current.has(sectionName)) {
              visibleStartTimes.current.set(sectionName, Date.now());
            }

            // 첫 노출 시 이벤트 전송
            if (!trackedSections.current.has(sectionName)) {
              trackedSections.current.add(sectionName);

              trackEvent(AnalyticsEvent.SECTION_VIEW, {
                section_name: sectionName,
                section_index: sectionIndex,
                page_path: window.location.pathname,
              });
            }
          } else {
            // 뷰포트에서 벗어날 때 노출 지속 시간 기록
            const startTime = visibleStartTimes.current.get(sectionName);
            if (startTime) {
              const duration = Date.now() - startTime;
              visibleStartTimes.current.delete(sectionName);

              // 2초 이상 노출된 경우만 지속 시간 이벤트 전송
              if (duration >= 2000) {
                trackEvent(AnalyticsEvent.SECTION_VIEW, {
                  section_name: sectionName,
                  section_index: sectionIndex,
                  page_path: window.location.pathname,
                  visible_duration_ms: duration,
                });
              }
            }
          }
        }
      },
      {
        threshold: 0.5, // 50% 이상 노출 시
        rootMargin: "0px",
      },
    );

    // data-section 속성이 있는 모든 요소 관찰
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
}
