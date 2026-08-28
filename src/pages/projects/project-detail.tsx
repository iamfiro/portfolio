import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useParams } from "react-router-dom";

import { getProject } from "@/feature/projects/data";
import { ProjectResponse, RelatedPost } from "@/feature/projects/schema";
import { BaseLayout } from "@/shared/components/layouts";
import SeoHead from "@/shared/components/seo-head";
import {
  Divider,
  Flex,
  Header,
  Heading,
  Image,
  Link,
  MarkdownContent,
  Stack,
  Tag,
  Text,
} from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./project-detail.module.scss";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const titleEntrance = usePageEntrance("title");
  const metaEntrance = usePageEntrance("subtitle");
  const bodyEntrance = usePageEntrance("body");

  const { data: response, isLoading } = useQuery<ProjectResponse>({
    queryKey: ["project", id],
    queryFn: () => getProject(id ?? ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Flex className={s.loadingWrapper} align="center" justify="center">
        <Text className={s.loadingText}>불러오는 중...</Text>
      </Flex>
    );
  }

  if (!response?.ok || !response.data) {
    return (
      <Flex className={s.loadingWrapper} align="center" justify="center">
        <Text className={s.loadingText}>프로젝트를 찾을 수 없습니다.</Text>
      </Flex>
    );
  }

  const project = response.data;
  const awards = project.awards ?? [];
  const relatedPosts = project.relatedPosts ?? [];

  return (
    <>
      <SeoHead
        title={project.title}
        description={project.description}
        path={`/projects/${id}`}
        ogImage={project.thumbnailUrl || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          author: {
            "@type": "Person",
            name: "Sungju Cho",
            url: "https://devfiro.com",
          },
          ...(project.thumbnailUrl ? { image: project.thumbnailUrl } : {}),
        }}
      />

      <Header logoHref="/projects" />

      <BaseLayout className={s.container}>
        <article className={s.article}>
          <motion.div {...titleEntrance}>
            <Heading as="h1" size="3xl" className={s.title}>
              {project.title}
            </Heading>
          </motion.div>

          <motion.div {...metaEntrance} className={s.metaSection}>
            <MarkdownContent
              content={project.description}
              variant="compact"
              className={s.description}
            />

            <Flex gap={8} wrap className={s.techStack}>
              {project.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </Flex>

            <Flex gap={12} className={s.links}>
              {project.githubUrl ? (
                <Link href={project.githubUrl} external className={s.linkButton}>
                  <Github size={16} aria-hidden="true" />
                  <Text size="sm">GitHub</Text>
                </Link>
              ) : null}
              {project.deployUrl ? (
                <Link href={project.deployUrl} external className={s.linkButton}>
                  <ExternalLink size={16} aria-hidden="true" />
                  <Text size="sm">Live Demo</Text>
                </Link>
              ) : null}
            </Flex>
          </motion.div>

          {project.thumbnailUrl ? (
            <motion.div {...bodyEntrance}>
              <Image
                src={project.thumbnailUrl}
                alt={`${project.title} thumbnail`}
                className={s.thumbnail}
                responsive
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 1200px"
              />
            </motion.div>
          ) : null}

          {project.content ? (
            <motion.div {...bodyEntrance} className={s.section}>
              <Divider />
              <Heading as="h2" size="xl" className={s.sectionHeading}>
                프로젝트 이야기
              </Heading>
              <MarkdownContent content={project.content} />
            </motion.div>
          ) : null}

          {awards.length > 0 ? (
            <motion.div {...bodyEntrance} className={s.section}>
              <Divider />
              <Heading as="h2" size="xl" className={s.sectionHeading}>
                수상
              </Heading>
              <Stack gap={12}>
                {awards.map((award) => (
                  <ProjectAwardCard key={award.id} award={award} />
                ))}
              </Stack>
            </motion.div>
          ) : null}

          {relatedPosts.length > 0 ? (
            <motion.div {...bodyEntrance} className={s.section}>
              <Divider />
              <Heading as="h2" size="xl" className={s.sectionHeading}>
                관련 아티클
              </Heading>
              <Stack gap={12}>
                {relatedPosts.map((post) => (
                  <RelatedPostCard key={post.id} post={post} />
                ))}
              </Stack>
            </motion.div>
          ) : null}
        </article>
      </BaseLayout>
    </>
  );
}
