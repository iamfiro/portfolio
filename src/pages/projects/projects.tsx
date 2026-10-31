import { useQuery } from "@tanstack/react-query";

import {
  LandingPageShell,
  LandingProjects,
} from "@/feature/landing/components";
import { getProjects } from "@/feature/projects/data";
import type { ProjectsResponse } from "@/feature/projects/schema";

export default function Projects() {
  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <LandingPageShell
      titleId="projects-title"
      documentTitle="프로젝트"
      lines={["문제에서 출발해", "출시까지 끝낸 일들"]}
    >
      <LandingProjects projects={data?.data ?? []} variant="page" />
    </LandingPageShell>
  );
}
