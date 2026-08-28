import type { Project } from "@/feature/projects/schema";
import {
  Grid,
  HoverCard,
  HoverCardTrigger,
  Image,
  Link,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface ProjectListProps {
  projects: Project[];
}

interface ProjectIconProps {
  project: Project;
}

function ProjectIcon({ project }: ProjectIconProps) {
  const iconSource = project.logoUrl ?? project.thumbnailUrl;

  if (!iconSource) return null;

  return (
    <HoverCardTrigger
      className={s.trigger}
      card={{
        title: project.title,
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
        <Image src={iconSource} alt="" className={s.icon} aria-hidden="true" />
      </Link>
    </HoverCardTrigger>
  );
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <HoverCard className={s.container} offset={16}>
      <Grid columns={4} className={s.grid}>
        {projects.map((project) => (
          <ProjectIcon key={project.id} project={project} />
        ))}
      </Grid>
    </HoverCard>
  );
}
