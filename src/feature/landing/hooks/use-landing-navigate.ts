import { type MouseEvent, useCallback } from "react";

import { usePageTransition } from "@/shared/components/layouts";

/** 랜딩 안 링크를 기본 이동 대신 페이지 전환 연출로 넘기는 클릭 핸들러 */
export function useLandingNavigate() {
  const { navigateTo } = usePageTransition();

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      navigateTo(event.currentTarget.getAttribute("href") ?? "/");
    },
    [navigateTo],
  );
}
