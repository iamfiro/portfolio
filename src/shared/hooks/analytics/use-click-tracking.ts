import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/shared/lib/analytics";

/**
 * data-track 속성 기반 클릭 이벤트 자동 트래킹
 *
 * 사용법:
 * <button data-track="cta_click" data-track-text="연락하기" data-track-location="hero">
 *   연락하기
 * </button>
 *
 * 지원 속성:
 * - data-track: 이벤트 이름 (필수)
 * - data-track-text: 요소 텍스트 (선택, 없으면 textContent 사용)
 * - data-track-location: 요소 위치 (선택)
 * - data-track-*: 추가 파라미터 (data-track-project-name → project_name)
 */
export function useClickTracking(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trackElement = target.closest<HTMLElement>("[data-track]");

      if (!trackElement) return;

      const eventName = trackElement.dataset.track;
      if (!eventName) return;

      // data-track-* 속성에서 파라미터 추출
      const params: Record<string, string> = {};

      for (const [key, value] of Object.entries(trackElement.dataset)) {
        if (key === "track") continue;
        if (!key.startsWith("track")) continue;

        // trackProjectName → project_name
        const paramKey = key
          .replace("track", "")
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "");

        if (paramKey && value) {
          params[paramKey] = value;
        }
      }

      // 기본 파라미터
      const elementText =
        params.text || trackElement.textContent?.trim().slice(0, 100) || "";
      const elementLocation = params.location || "";

      trackEvent(AnalyticsEvent.CTA_CLICK, {
        element_text: elementText,
        element_location: elementLocation,
        destination_url:
          trackElement.getAttribute("href") || params.url || undefined,
        ...params,
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}
