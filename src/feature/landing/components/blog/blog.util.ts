import type { Post } from "@/feature/blog/schema";

export const BLOG_HEADLINE_LINES = ["만들며 배운 것을", "글로 남겨요"];

/** 피처 카드 1장 + 아래 작은 카드 2장 */
const LANDING_POST_LIMIT = 3;

/** 최신 글부터 랜딩에 올릴 만큼만 고른다 */
export function selectLandingPosts(posts: Post[]): Post[] {
  return [...posts]
    .sort((first, second) => second.date.getTime() - first.date.getTime())
    .slice(0, LANDING_POST_LIMIT);
}

/** 2026-10-20 → "2026. 10. 20" */
export function formatPostDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}. ${month}. ${day}`;
}
