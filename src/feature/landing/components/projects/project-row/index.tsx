import { motion } from "framer-motion";
import type { MouseEvent } from "react";

import {
  getRevealProps,
  LANDING_EASE,
} from "@/feature/landing/utils/reveal.util";
import type { Project } from "@/feature/projects/schema";
import { getStackIcons } from "@/feature/projects/utils";
import { Box, Heading, Image, Link, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  project: Project;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function ProjectRow({ project, onNavigate }: Props) {
  const stackIcons = getStackIcons(project.techStack);
  const tags = project.caseStudy?.tags ?? [];

  return (
    <motion.article className={s.row} {...getRevealProps()}>
      <Link
        href={`/projects/${project.id}`}
        className={s.link}
        onClick={onNavigate}
      >
        <Box className={s.info}>
          <Box className={s.copy}>
            <Heading as="h3" className={s.name}>
              {project.title}
            </Heading>
            <Text as="p" className={s.description}>
              {project.description}
            </Text>
          </Box>

          {tags.length > 0 && (
            <Box className={s.tags}>
              {tags.map((tag) => (
                <Text as="span" key={tag} className={s.tag}>
                  {tag}
                </Text>
              ))}
            </Box>
          )}
          {stackIcons.length > 0 && (
            <Box className={s.stack}>
              {stackIcons.map(({ tech, src }) => (
                <Box key={tech} className={s.tool} title={tech}>
                  <Image src={src} alt={tech} objectFit="contain" />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* 아래에서 위로 걷히며 드러나는 썸네일 */}
        <motion.div
          className={s.media}
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, ease: LANDING_EASE }}
        >
          {project.thumbnailUrl && (
            <Image
              src={project.thumbnailUrl}
              alt={`${project.title} 대표 이미지`}
              className={s.image}
              loading="lazy"
              decoding="async"
            />
          )}
        </motion.div>
      </Link>
    </motion.article>
  );
}
