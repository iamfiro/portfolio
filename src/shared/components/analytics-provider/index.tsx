import { type ReactNode, useEffect } from "react";

import {
  useClickTracking,
  useOutboundLinkTracking,
  usePageView,
  usePerformanceTracking,
  useScrollDepth,
  useSectionTracking,
  useTimeOnPage,
} from "@/shared/hooks/analytics";
import { initializeGA, setUserProperties } from "@/shared/lib/analytics";

interface Props {
  children: ReactNode;
}

/**
 * 모든 Analytics 훅을 통합하는 Provider
 * - GA4 초기화
 * - 페이지뷰, 스크롤, 체류시간, 클릭, 섹션 노출, 외부 링크 트래킹
 * - 유저 속성 설정 (재방문 여부, 디바이스 타입)
 */
export default function AnalyticsProvider({ children }: Props) {
  useEffect(() => {
    initializeGA();

    // 유저 속성 설정
    const isReturning = localStorage.getItem("portfolio_visited") === "true";
    localStorage.setItem("portfolio_visited", "true");

    setUserProperties({
      user_type: isReturning ? "returning" : "new",
      device_type: getDeviceType(),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_scheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    });
  }, []);

  usePageView();
  useScrollDepth();
  useTimeOnPage();
  useClickTracking();
  useSectionTracking();
  useOutboundLinkTracking();
  usePerformanceTracking();

  return <>{children}</>;
}

function getDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
