import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback } from "react";

import { getProjects } from "@/feature/projects/api";
import type { Project, ProjectsResponse } from "@/feature/projects/schema";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import {
  Card,
  Flex,
  Heading,
  Image,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

function ProjectCard({ project }: { project: Project }) {
  return (
    <a href={`/projects/${project.id}`} className={s.cardLink}>
      <Card className={s.card}>
        <Stack className={s.cardBody}>
          <Heading as="h3" className={s.cardTitle}>
            {project.title}
          </Heading>
          <Text className={s.cardDescription}>{project.description}</Text>
        </Stack>
        {project.thumbnailUrl && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              className={s.thumbnail}
            />
          </motion.div>
        )}
      </Card>
    </a>
  );
}

export default function Project() {
  const { navigateTo } = usePageTransition();

  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = (data?.data ?? []).slice(0, 4);

  const renderProject = useCallback(
    (project: Project) => <ProjectCard key={project.id} project={project} />,
    [],
  );

  const handleViewMore = useCallback(() => {
    navigateTo("/projects");
  }, [navigateTo]);

  return (
    <Section className={s.project} size="md">
      <Stack className={s.layout}>
        <Flex className={s.grid} wrap>
          {projects.map(renderProject)}
        </Flex>

        <Flex className={s.viewMore} onClick={handleViewMore}>
          <Text className={s.viewMoreText}>More Projects</Text>
          <ArrowRight size={16} />
        </Flex>
      </Stack>
    </Section>
  );
}
