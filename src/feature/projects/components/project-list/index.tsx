import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/feature/projects/data";
import type { ProjectsResponse } from "@/feature/projects/schema";
import { Flex, Grid, Text } from "@/shared/components/ui";

import ProjectCard from "../project-card";

import s from "./style.module.scss";

export default function ProjectList() {
  const { data, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = data?.data ?? [];

  if (isLoading) {
    return (
      <Flex align="center" justify="center" className={s.loadingWrapper}>
        <Text className={s.loadingText}>불러오는 중...</Text>
      </Flex>
    );
  }

  if (projects.length === 0) {
    return (
      <Flex direction="column" gap={16} align="center" width="100%">
        <Text size="xl" weight="semibold">
          등록된 프로젝트가 없습니다
        </Text>
      </Flex>
    );
  }

  return (
    <Grid className={s.grid}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </Grid>
  );
}
