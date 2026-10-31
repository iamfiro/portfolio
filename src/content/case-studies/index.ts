import type { CaseStudy } from "@/feature/projects/schema";

import pockettime from "./pockettime";

// key는 src/content/projects/*.md 파일명(프로젝트 id)과 일치해야 함
export const caseStudies: Record<string, CaseStudy> = {
  pockettime,
};
