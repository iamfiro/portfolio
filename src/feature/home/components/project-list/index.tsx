import { useEdgeColor } from "@/feature/home/hooks";
import type { Project } from "@/feature/projects/schema";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Grid,
  HoverCard,
  HoverCardTrigger,
  Image,
  Link,
  Text,
} from "@/shared/components/ui";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";

import s from "./style.module.scss";

interface ProjectListProps {
  delayIndexOffset: number;
  isVisible: boolean;
  onAnimationComplete: () => void;
  projects: Project[];
}

interface ProjectIconProps {
  delayIndexOffset: number;
  index: number;
  isVisible: boolean;
  onAnimationComplete?: () => void;
  project: Project;
}

function ProjectIcon({
  delayIndexOffset,
  index,
  isVisible,
  onAnimationComplete,
  project,
}: ProjectIconProps) {
  const iconSource = project.logoUrl ?? project.thumbnailUrl;
  const { style: iconStyle, handleLoad } = useEdgeColor(iconSource ?? "");

  if (!iconSource) return null;

  return (
    <motion.div
      className={s.entrance}
      initial={HOME_ANIMATION_HIDDEN}
      animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
      transition={getHomeAnimationTransition(index + delayIndexOffset)}
      onAnimationComplete={onAnimationComplete}
    >
      <HoverCardTrigger
        className={s.trigger}
        card={{
          title: project.title,
          imageUrl: project.thumbnailUrl,
          items: [
            project.description,
            ...(project.techStack.length > 0
              ? [`기술 스택 · ${project.techStack.join(", ")}`]
              : []),
          ],
        }}
      >
        <Link
          href={`/projects/${project.id}`}
          className={s.projectLink}
          aria-label={`${project.title} 프로젝트 상세 보기`}
        >
          <Image
            src={iconSource}
            alt=""
            className={s.icon}
            aria-hidden="true"
            crossOrigin="anonymous"
            onLoad={handleLoad}
            style={iconStyle}
          />
        </Link>
        <Text
          as="span"
          size="xs"
          weight="medium"
          color="subtle"
          className={s.name}
        >
          {project.title}
        </Text>
      </HoverCardTrigger>
    </motion.div>
  );
}

export default function ProjectList({
  delayIndexOffset,
  isVisible,
  onAnimationComplete,
  projects,
}: ProjectListProps) {
  const visibleProjects = projects.filter(
    (project) => project.logoUrl || project.thumbnailUrl,
  );

  useEffect(() => {
    if (!isVisible || visibleProjects.length > 0) return;

    onAnimationComplete();
  }, [isVisible, onAnimationComplete, visibleProjects.length]);

  return (
    <HoverCard className={s.container} offset={16}>
      <Grid columns="repeat(5, minmax(0, 1fr))" className={s.grid}>
        {visibleProjects.map((project, index) => (
          <ProjectIcon
            key={project.id}
            delayIndexOffset={delayIndexOffset}
            index={index}
            isVisible={isVisible}
            onAnimationComplete={
              index === visibleProjects.length - 1
                ? onAnimationComplete
                : undefined
            }
            project={project}
          />
        ))}
      </Grid>
    </HoverCard>
  );
}
