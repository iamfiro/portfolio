import Lenis from "lenis";
import { useEffect } from "react";

/**
 * 페이지 전체에 관성(inertia) 스크롤을 적용한다.
 * - 모션 줄이기 설정 시 적용하지 않는다.
 * - Drawer·BottomSheet처럼 body를 overflow: hidden으로 잠그는 경우 스크롤을 멈춘다.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true });

    // body 스크롤 잠금 여부에 맞춰 Lenis를 멈추고 재개한다
    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    syncLock();

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);
}
