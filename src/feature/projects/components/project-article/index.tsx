import PageShell from "@/feature/landing/components/page-shell";
import type { Project } from "@/feature/projects/schema";

import ProjectBody from "./project-body";
import ProjectIntro from "./project-intro";
import ProjectSection from "./project-section";
import RelatedPosts from "./related-posts";

interface Props {
  project: Project;
}

/** 랜딩과 같은 뼈대 안에서, 프로젝트 머리·소개 아래로 마크다운 본문을 펼친다 */
export default function ProjectArticle({ project }: Props) {
  const relatedPosts = project.relatedPosts ?? [];

  return (
    <PageShell
      titleId="project-article-title"
      lines={[project.title, project.description]}
      icon={project.logoUrl}
      mutedFrom={1}
    >
      <ProjectIntro project={project} />

      {project.content && <ProjectBody content={project.content} />}

      {relatedPosts.length > 0 && (
        <ProjectSection id="related" title="관련 아티클">
          <RelatedPosts posts={relatedPosts} />
        </ProjectSection>
      )}
    </PageShell>
  );
}
