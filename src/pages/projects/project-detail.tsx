import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { LandingPageShell } from "@/feature/landing/components";
import { ProjectArticle } from "@/feature/projects/components";
import { getProject } from "@/feature/projects/data";
import type { ProjectResponse } from "@/feature/projects/schema";

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
      <ProjectArticle project={project} />
    </>
  );
}
