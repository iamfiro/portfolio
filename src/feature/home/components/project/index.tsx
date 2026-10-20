import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";

import { useHomeSectionAnimation } from "@/feature/home/hooks";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";
import { getProjects } from "@/feature/projects/data";
import type { Project, ProjectsResponse } from "@/feature/projects/schema";
import { getStackIcons } from "@/feature/projects/utils";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import {
  Card,
  Flex,
  Heading,
  Image,
  Link,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import ProjectList from "../project-list";

import s from "./style.module.scss";

interface ProjectCardProps {
  project: Project;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

function ProjectCard({
  project,
  isVisible,
  onAnimationComplete,
}: ProjectCardProps) {
  const stackIcons = getStackIcons(project.techStack);

  return (
    <motion.div
      className={s.entrance}
      initial={HOME_ANIMATION_HIDDEN}
      animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
      transition={getHomeAnimationTransition(0, 0.52)}
      onAnimationComplete={onAnimationComplete}
    >
      <Link href={`/projects/${project.id}`} className={s.projectLink}>
        <Card variant="elevated" className={s.projectCard} p={0}>
          {project.thumbnailUrl && (
            <div className={s.thumbnailWrapper}>
              <Image
                src={project.thumbnailUrl}
                alt={`${project.title} 대표 이미지`}
                className={s.thumbnail}
              />
            </div>
          )}

          <Flex className={s.projectDetails} align="flex-start" gap={16}>
            <Flex className={s.projectSummary} align="flex-start" gap={12}>
              {(project.logoUrl || project.thumbnailUrl) && (
                <Image
                  src={project.logoUrl ?? project.thumbnailUrl ?? ""}
                  alt=""
                  className={s.appIcon}
                  aria-hidden="true"
                />
              )}
              <Stack className={s.projectCopy} gap={0}>
                <Heading as="h3" size="xs" className={s.projectName}>
                  {project.title}
                </Heading>
                <Text size="xs" color="subtle" className={s.projectDescription}>
                  {project.description}
                </Text>
              </Stack>
            </Flex>

            {stackIcons.length > 0 && (
              <Flex className={s.stackList} align="center" gap={12}>
                {stackIcons.map(({ tech, src }) => (
                  <Image
                    key={tech}
                    src={src}
                    alt={tech}
                    className={s.stackIcon}
                  />
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Project() {
  const { pageReady } = usePageTransition();
  const { complete, isVisible, ref } = useHomeSectionAnimation({
    enabled: pageReady,
    id: "project",
    order: 1,
    requestOnMount: true,
  });
  const { data, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const featuredProject = (data?.data ?? []).find(
    (project) => project.id === "pockettime",
  );
  const otherProjects = (data?.data ?? []).filter(
    (project) => project.id !== featuredProject?.id,
  );

  useEffect(() => {
    if (
      !isVisible ||
      isLoading ||
      featuredProject ||
      otherProjects.length > 0
    ) {
      return;
    }

    complete();
  }, [complete, featuredProject, isLoading, isVisible, otherProjects.length]);

  return (
    <motion.div ref={ref}>
      <Section className={s.projectSection} size="md">
        {featuredProject && (
          <ProjectCard
            project={featuredProject}
            isVisible={isVisible}
            onAnimationComplete={
              otherProjects.length === 0 ? complete : undefined
            }
          />
        )}
        {otherProjects.length > 0 && (
          <ProjectList
            projects={otherProjects}
            isVisible={isVisible}
            delayIndexOffset={featuredProject ? 7 : 0}
            onAnimationComplete={complete}
          />
        )}
      </Section>
    </motion.div>
  );
}
