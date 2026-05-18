import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { getProject } from "@/feature/projects/api";
import { ProjectResponse, RelatedPost } from "@/feature/projects/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  Divider,
  Flex,
  Header,
  Heading,
  Image,
  Tag,
  Text,
} from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./project-detail.module.scss";

function RelatedPostItem({ post }: { post: RelatedPost }) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <a href={`/blog/${post.title}`} className={s.relatedPostLink}>
      <Flex direction="column" gap={6} className={s.relatedPostItem}>
        <Text className={s.relatedPostTitle}>{post.title}</Text>
        {formattedDate && (
          <Text size="xs" className={s.relatedPostDate}>
            {formattedDate}
          </Text>
        )}
        {post.tags && post.tags.length > 0 && (
          <Flex gap={4} wrap>
            {post.tags.map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
          </Flex>
        )}
      </Flex>
    </a>
  );
}

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
  const relatedPosts = project.relatedPosts ?? [];

  return (
    <>
      <Helmet>
        <title>{project.title}</title>
      </Helmet>

      <Header logoHref="/projects" />

      <BaseLayout className={s.container}>
        <article className={s.article}>
          <motion.div {...titleEntrance}>
            <Heading as="h1" size="3xl" className={s.title}>
              {project.title}
            </Heading>
          </motion.div>

          <motion.div {...metaEntrance} className={s.metaSection}>
            <Text className={s.description}>{project.description}</Text>

            <Flex gap={8} wrap className={s.techStack}>
              {project.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </Flex>

            <Flex gap={12} className={s.links}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.linkButton}
                >
                  <Github size={16} />
                  <Text size="sm">GitHub</Text>
                </a>
              )}
              {project.deployUrl && (
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.linkButton}
                >
                  <ExternalLink size={16} />
                  <Text size="sm">Live Demo</Text>
                </a>
              )}
            </Flex>
          </motion.div>

          {project.thumbnailUrl && (
            <motion.div {...bodyEntrance}>
              <Image
                src={project.thumbnailUrl}
                alt={`${project.title} thumbnail`}
                className={s.thumbnail}
                responsive
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 1200px"
              />
            </motion.div>
          )}

          {relatedPosts.length > 0 && (
            <motion.div {...bodyEntrance} className={s.relatedSection}>
              <Divider />
              <Heading as="h2" size="xl" className={s.relatedHeading}>
                관련 아티클
              </Heading>
              <Flex direction="column" gap={16}>
                {relatedPosts.map((post) => (
                  <RelatedPostItem key={post.title} post={post} />
                ))}
              </Flex>
            </motion.div>
          )}
        </article>
      </BaseLayout>
    </>
  );
}
