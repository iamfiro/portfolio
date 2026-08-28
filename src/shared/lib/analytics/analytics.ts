import ReactGA from "react-ga4";

import {
  AnalyticsEvent,
  type AnalyticsEventMap,
  PageCategory,
} from "./analytics.type";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

/**
 * GA4 초기화
 * - SPA에서 자동 page_view 비활성화 (수동 트래킹)
 * - 개발 환경에서는 debug 모드 활성화
 */
export function initializeGA(): void {
  if (import.meta.env.DEV) {
    console.log("[Analytics] dev 모드에서는 GA를 비활성화합니다.");
    return;
  }

  if (isInitialized || !GA_MEASUREMENT_ID) return;

  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gaOptions: {
      anonymizeIp: true,
      cookieExpires: 63072000, // 2년
    },
    gtagOptions: {
      send_page_view: false, // SPA에서 수동 page_view 트래킹
      transport_type: "beacon",
    },
  });

  isInitialized = true;

  if (import.meta.env.DEV) {
    console.log("[Analytics] GA4 초기화 완료:", GA_MEASUREMENT_ID);
  }
}

/**
 * Type-safe 이벤트 전송
 */
export function trackEvent<E extends AnalyticsEvent>(
  eventName: E,
  params: AnalyticsEventMap[E],
): void {
  if (!isInitialized) return;

  ReactGA.event(eventName, params as unknown as Record<string, unknown>);

  if (import.meta.env.DEV) {
    console.log("[Analytics] Event:", eventName, params);
  }
}

/**
 * 페이지뷰 전송 (SPA 라우트 변경 시)
 */
export function trackPageView(
  path: string,
  title: string,
  category: PageCategory,
): void {
  if (!isInitialized) return;

  trackEvent(AnalyticsEvent.PAGE_VIEW, {
    page_path: path,
    page_title: title,
    page_category: category,
    page_referrer: document.referrer,
  });
}

/**
 * 유저 속성 설정
 */
export function setUserProperties(
  properties: Record<string, string | number | boolean>,
): void {
  if (!isInitialized) return;

  ReactGA.set(properties);

  if (import.meta.env.DEV) {
    console.log("[Analytics] User Properties:", properties);
  }
}

/**
 * 경로 → 페이지 카테고리 매핑
 */
export function getPageCategory(pathname: string): PageCategory {
  if (pathname === "/") return PageCategory.HOME;
  if (pathname === "/projects") return PageCategory.PROJECTS;
  if (pathname === "/awards") return PageCategory.AWARDS;
  if (pathname.startsWith("/blog/")) return PageCategory.BLOG_ARTICLE;
  if (pathname === "/blog") return PageCategory.BLOG;
  return PageCategory.HOME;
}

/**
 * 체류 시간 → engagement level 매핑
 */
export function getEngagementLevel(
  seconds: number,
): "bounce" | "low" | "medium" | "high" | "deep" {
  if (seconds < 5) return "bounce";
  if (seconds < 15) return "low";
  if (seconds < 45) return "medium";
  if (seconds < 120) return "high";
  return "deep";
}

export { isInitialized };
