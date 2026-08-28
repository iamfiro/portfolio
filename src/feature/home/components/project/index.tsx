import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getProjects } from "@/feature/projects/data";
import type { Project, ProjectsResponse } from "@/feature/projects/schema";
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

const STACK_ICON_PATHS: Record<string, string> = {
  android: "/icon/stack/android.svg",
  cypress: "/icon/stack/cypress.svg",
  electron: "/icon/stack/electron.svg",
  eslint: "/icon/stack/eslint.svg",
  expo: "/icon/stack/expo.svg",
  express: "/icon/stack/express.svg",
  flutter: "/icon/stack/flutter.svg",
  githubactions: "/icon/stack/githubactions.svg",
  jest: "/icon/stack/jest.svg",
  ios: "/icon/stack/ios.svg",
  kotlin: "/icon/stack/kotlin.svg",
  mysql: "/icon/stack/mysql.svg",
  nestjs: "/icon/stack/nestjs.svg",
  nextjs: "/icon/stack/nextjs.svg",
  notion: "/icon/stack/notion.svg",
  prisma: "/icon/stack/prisma.svg",
  react: "/icon/stack/react.svg",
  redis: "/icon/stack/redis.svg",
  sass: "/icon/stack/sass.svg",
  socketio: "/icon/stack/socketdotio.svg",
  storybook: "/icon/stack/storybook.svg",
  typescript: "/icon/stack/typescript.svg",
};

function getStackIconPath(tech: string): string | null {
  const normalizedTech = tech.toLowerCase().replace(/[.\s_-]/g, "");
  return STACK_ICON_PATHS[normalizedTech] ?? null;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const stackIcons = project.techStack
    .map((tech) => ({ tech, src: getStackIconPath(tech) }))
    .filter((item): item is { tech: string; src: string } => Boolean(item.src));

  return (
    <Link href={`/projects/${project.id}`} className={s.projectLink}>
      <Card variant="elevated" className={s.projectCard} p={0}>
        {project.thumbnailUrl && (
          <motion.div
            className={s.thumbnailWrapper}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={project.thumbnailUrl}
              alt={`${project.title} 대표 이미지`}
              className={s.thumbnail}
            />
          </motion.div>
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
  );
}

export default function Project() {
  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const featuredProject = (data?.data ?? []).find(
    (project) => project.id === "pockettime",
  );
  const otherProjects = (data?.data ?? []).filter(
    (project) => project.id !== featuredProject?.id,
  );

  return (
    <Section className={s.projectSection} size="md">
      {featuredProject && <ProjectCard project={featuredProject} />}
      {otherProjects.length > 0 && <ProjectList projects={otherProjects} />}
    </Section>
  );
}
