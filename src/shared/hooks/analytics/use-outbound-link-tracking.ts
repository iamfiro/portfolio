import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/shared/lib/analytics";

/**
 * 외부 링크 클릭 자동 트래킹
 * - target="_blank" 또는 외부 도메인 링크 감지
 * - navigator.sendBeacon 패턴으로 안정적 전송
 */
export function useOutboundLinkTracking(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;

      // 외부 링크 판별
      const isExternal =
        anchor.target === "_blank" ||
        (href.startsWith("http") && !href.includes(window.location.hostname));

      if (!isExternal) return;

      trackEvent(AnalyticsEvent.OUTBOUND_LINK_CLICK, {
        link_url: href,
        link_text: anchor.textContent?.trim().slice(0, 100) || "",
        link_location: getElementLocation(anchor),
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}

function getElementLocation(element: HTMLElement): string {
  // 가장 가까운 section, header, footer, nav, main 찾기
  const landmark = element.closest(
    "header, footer, nav, main, section, [data-section]",
  );

  if (landmark) {
    if (landmark instanceof HTMLElement && landmark.dataset.section) {
      return landmark.dataset.section;
    }
    return landmark.tagName.toLowerCase();
  }

  return "unknown";
}
