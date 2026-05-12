import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getProjects } from "@/feature/projects/api";
import { Project, ProjectsResponse } from "@/feature/projects/schema";
import {
  Card,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={`/projects/${project.id}`}
      className={s.cardLink}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 1.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.5 + index * 0.15,
      }}
    >
      <Card className={s.card}>
        <Stack className={s.cardBody}>
          <Heading as="h3" className={s.cardTitle}>
            {project.title}
          </Heading>
          <Text className={s.cardDescription}>{project.description}</Text>
        </Stack>
        {project.thumbnailUrl && (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            className={s.thumbnail}
          />
        )}
      </Card>
    </motion.a>
  );
}

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
    <Stack className={s.container}>
      <div className={s.grid}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Stack>
  );
}
