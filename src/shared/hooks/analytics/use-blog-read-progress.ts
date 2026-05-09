import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { AnalyticsEvent, trackEvent } from "@/shared/lib/analytics";

/**
 * 블로그 글 읽기 진행률 트래킹
 * - 스크롤 기반 25%, 50%, 75%, 100% 진행률 측정
 * - 글 영역(article) 기준으로 계산
 * - 체류 시간도 함께 기록
 *
 * @param articleId - 블로그 글 ID
 * @param articleTitle - 블로그 글 제목
 * @param contentSelector - 글 본문 영역 CSS 선택자 (기본: article)
 */
export function useBlogReadProgress(
  articleId: string,
  articleTitle: string,
  contentSelector = "article",
): void {
  const location = useLocation();
  const trackedProgress = useRef(new Set<number>());
  const startTimeRef = useRef(Date.now());

  const resetProgress = useCallback(() => {
    trackedProgress.current.clear();
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    resetProgress();
  }, [location.pathname, resetProgress]);

  useEffect(() => {
    if (!articleId) return;

    const THRESHOLDS = [25, 50, 75, 100] as const;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const contentElement = document.querySelector(contentSelector);
        if (!contentElement) {
          ticking = false;
          return;
        }

        const rect = contentElement.getBoundingClientRect();
        const contentHeight = rect.height;
        const contentTop = rect.top + window.scrollY;
        const scrollPosition = window.scrollY + window.innerHeight;
        const progress = Math.min(
          100,
          Math.max(
            0,
            Math.round(((scrollPosition - contentTop) / contentHeight) * 100),
          ),
        );

        for (const threshold of THRESHOLDS) {
          if (
            progress >= threshold &&
            !trackedProgress.current.has(threshold)
          ) {
            trackedProgress.current.add(threshold);

            const timeSpent = Math.round(
              (Date.now() - startTimeRef.current) / 1000,
            );

            trackEvent(AnalyticsEvent.BLOG_READ_PROGRESS, {
              article_id: articleId,
              article_title: articleTitle,
              progress_percentage: threshold,
              time_spent_seconds: timeSpent,
            });
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleId, articleTitle, contentSelector]);
}
