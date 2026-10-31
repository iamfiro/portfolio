import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { LandingPageShell } from "@/feature/landing/components";
import { CaseStudyView } from "@/feature/projects/components";
import { getProject } from "@/feature/projects/data";
import type {
  CaseStudy,
  Project,
  ProjectResponse,
} from "@/feature/projects/schema";

// 케이스 스터디가 없는 프로젝트도 같은 화면으로 보이도록 기본 정보만으로 채운다
function toBasicCaseStudy(project: Project): CaseStudy {
  return {
    year: project.startDate.slice(0, 4),
    lead: "",
    tags: project.techStack,
    sections: [],
  };
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading } = useQuery<ProjectResponse>({
    queryKey: ["project", id],
    queryFn: () => getProject(id ?? ""),
    enabled: !!id,
  });

  if (isLoading) return null;

  if (!response?.ok || !response.data) {
    return (
      <LandingPageShell
        titleId="project-missing-title"
        lines={["프로젝트를", "찾을 수 없어요"]}
      >
        {null}
      </LandingPageShell>
    );
  }

  const project = response.data;

  return (
    <>
      <Helmet>
        <title>{project.title}</title>
      </Helmet>
      <CaseStudyView
        project={project}
        caseStudy={project.caseStudy ?? toBasicCaseStudy(project)}
      />
    </>
  );
}
