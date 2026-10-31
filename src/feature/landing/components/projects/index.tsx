import { useLandingNavigate } from "@/feature/landing/hooks/use-landing-navigate";
import type { Project } from "@/feature/projects/schema";
import { Box } from "@/shared/components/ui";

import SectionHead from "../section-head";
import SectionMascots from "../section-mascots";

import ProjectRow from "./project-row";
import {
  PROJECTS_HEADLINE_LINES,
  selectLandingProjects,
} from "./projects.util";

import s from "./style.module.scss";

const TITLE_ID = "landing-projects-title";

interface Props {
  projects: Project[];
  /** "page"는 프로젝트 페이지 본문: 머리 없이 전체 프로젝트를 펼친다 */
  variant?: "section" | "page";
}

/** 줄 단위로 올라오는 머리 문장 아래로 대표 프로젝트를 한 줄씩 펼치고, 전체 목록으로 이어 준다 */
export default function LandingProjects({
  projects,
  variant = "section",
}: Props) {
  const handleNavigate = useLandingNavigate();
  const isPage = variant === "page";
  const featured = isPage ? projects : selectLandingProjects(projects);

  if (featured.length === 0) return null;

  return (
    <Box
      as="section"
      className={s.projects}
      aria-labelledby={isPage ? undefined : TITLE_ID}
    >
      {!isPage && (
        <SectionHead
          titleId={TITLE_ID}
          lines={PROJECTS_HEADLINE_LINES}
          link={{ href: "/projects", label: "전체 프로젝트 보기" }}
        >
          <SectionMascots section="projects" />
        </SectionHead>
      )}

      <Box className={s.list}>
        {featured.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            onNavigate={handleNavigate}
          />
        ))}
      </Box>
    </Box>
  );
}
