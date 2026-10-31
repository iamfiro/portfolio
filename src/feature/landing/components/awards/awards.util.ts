import type { Award } from "@/feature/awards/schema";

export const AWARDS_HEADLINE_LINES = ["대회에서 직접", "증명해 온 순간들"];

export interface AwardYearGroup {
  year: number;
  awards: Award[];
}

/** 최신 연도부터 연도별로 묶는다. 같은 해 안에선 들어온 순서를 지킨다 */
export function groupAwardsByYear(awards: Award[]): AwardYearGroup[] {
  const groups = new Map<number, Award[]>();

  for (const award of awards) {
    const year = new Date(award.date).getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), award]);
  }

  return [...groups.entries()]
    .sort(([firstYear], [secondYear]) => secondYear - firstYear)
    .map(([year, yearAwards]) => ({ year, awards: yearAwards }));
}
