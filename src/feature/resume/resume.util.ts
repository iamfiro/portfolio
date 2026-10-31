/**
 * 이력서에 표시할 기간 문자열을 만듭니다.
 * frontmatter 날짜는 `2026-08-28`, `2025-01-01`(연도만 아는 경우), `2026`처럼 형식이 섞여 있습니다.
 */
export function formatResumePeriod(
  start: string | Date,
  end?: string | null,
): string {
  // TODO(human)
  return end ? `${String(start)} — ${end}` : String(start);
}
