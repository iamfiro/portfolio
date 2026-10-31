import PageShell from "@/feature/landing/components/page-shell";
import type {
  CaseStudy,
  CaseStudyBlock,
  Project,
} from "@/feature/projects/schema";

import CaseStudyIntro from "./case-study-intro";
import CaseStudySection from "./case-study-section";
import FeatureList from "./feature-list";
import FlowSteps from "./flow-steps";
import RelatedPosts from "./related-posts";
import ShowcaseList from "./showcase-list";
import SpecList from "./spec-list";

interface Props {
  project: Project;
  caseStudy: CaseStudy;
}

function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "features":
      return <FeatureList items={block.items} />;
    case "specs":
      return <SpecList items={block.items} />;
    case "flow":
      return <FlowSteps stages={block.stages} />;
    case "showcase":
      return <ShowcaseList items={block.items} />;
  }
}

/** 랜딩과 같은 뼈대 안에서, 프로젝트 이름·한 줄 소개를 머리로 케이스 스터디를 펼친다 */
export default function CaseStudyView({ project, caseStudy }: Props) {
  const relatedPosts = project.relatedPosts ?? [];

  return (
    <PageShell
      titleId="case-study-title"
      lines={[project.title, project.description]}
      icon={project.logoUrl}
      mutedFrom={1}
    >
      <CaseStudyIntro project={project} caseStudy={caseStudy} />

      {caseStudy.sections.map((section) => (
        <CaseStudySection
          key={section.id}
          id={section.id}
          title={section.title}
          paragraphs={section.paragraphs}
        >
          {section.block && <CaseStudyBlockView block={section.block} />}
        </CaseStudySection>
      ))}

      {relatedPosts.length > 0 && (
        <CaseStudySection id="related" title="관련 아티클" paragraphs={[]}>
          <RelatedPosts posts={relatedPosts} />
        </CaseStudySection>
      )}
    </PageShell>
  );
}
