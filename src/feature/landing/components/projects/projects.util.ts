import type { Project } from "@/feature/projects/schema";

/** 랜딩에 한 줄씩 펼쳐 보여 줄 최대 프로젝트 수 */
export const LANDING_PROJECT_LIMIT = 4;

/** 섹션 머리의 큰 문장. 줄 단위로 마스크 아래에서 올라온다 */
export const PROJECTS_HEADLINE_LINES = ["프로젝트 리스트"];

/** 전체 프로젝트 중 랜딩에 올릴 대표 프로젝트를 골라 보여 줄 순서대로 돌려준다 */
export function selectLandingProjects(projects: Project[]): Project[] {
  return projects.slice(0, LANDING_PROJECT_LIMIT);
}
