import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { getPageCategory, trackPageView } from "@/shared/lib/analytics";

/**
 * SPA 라우트 변경 시 자동 페이지뷰 트래킹
 * - document.title 업데이트 후 전송 (setTimeout 0)
 * - 초기 로드 + 라우트 변경 모두 처리
 */
export function usePageView(): void {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 첫 렌더링 시 약간의 딜레이로 title 업데이트 대기
    const delay = isFirstRender.current ? 100 : 0;
    isFirstRender.current = false;

    const timer = setTimeout(() => {
      const path = location.pathname + location.search;
      const title = document.title;
      const category = getPageCategory(location.pathname);

      trackPageView(path, title, category);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);
}
