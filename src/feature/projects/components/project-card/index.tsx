import { motion } from "framer-motion";

import type { Project } from "@/feature/projects/schema";
import { getStackIcons } from "@/feature/projects/utils";
import {
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const iconSrc = project.logoUrl ?? project.thumbnailUrl;
  const stackIcons = getStackIcons(project.techStack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3 + index * 0.08,
      }}
    >
      <Link href={`/projects/${project.id}`} className={s.cardLink}>
        <Stack gap={12}>
          <div className={s.thumbnailWrapper}>
            {project.thumbnailUrl && (
              <Image
                src={project.thumbnailUrl}
                alt={`${project.title} 대표 이미지`}
                className={s.thumbnail}
                responsive={project.thumbnailUrl.startsWith("http")}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            )}
          </div>

          <Flex className={s.details} align="flex-start" gap={16}>
            <Flex className={s.summary} align="flex-start" gap={12}>
              {iconSrc && (
                <Image
                  src={iconSrc}
                  alt=""
                  aria-hidden="true"
                  className={s.appIcon}
                />
              )}
              <Stack className={s.copy} gap={0}>
                <Heading as="h3" size="xs" className={s.name}>
                  {project.title}
                </Heading>
                <Text size="sm" color="subtle" truncate>
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
                    objectFit="contain"
                    className={s.stackIcon}
                  />
                ))}
              </Flex>
            )}
          </Flex>
        </Stack>
      </Link>
    </motion.div>
  );
}
