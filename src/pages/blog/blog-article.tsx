import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { getPost } from "@/feature/blog/api";
import { Giscus, TableOfContents } from "@/feature/blog/components";
import MarkdownContent from "@/feature/blog/components/markdown-content";
import { PostResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  Divider,
  Flex,
  Header,
  Heading,
  Tag,
  Text,
} from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./blog-article.module.scss";

type Post = NonNullable<PostResponse>;

// React re-render 없이 DOM 직접 조작 → 스크롤마다 layout 재계산 없음
function useScrollProgressRef() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!fillRef.current) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? window.scrollY / docHeight : 0;
      fillRef.current.style.transform = `scaleX(${ratio})`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return fillRef;
}

export default function BlogArticle() {
  const { id } = useParams();
  const progressFillRef = useScrollProgressRef();
  const contentRef = useRef<HTMLElement>(null);

  const titleEntrance = usePageEntrance("title");
  const metaEntrance = usePageEntrance("subtitle");
  const thumbnailEntrance = usePageEntrance("body");
  const contentEntrance = usePageEntrance("tail");

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => getPost(id || ""),
  });

  if (isLoading) {
    return (
      <Flex className={s.loading_wrapper} align="center" justify="center">
        <Text className={s.loading_text}>불러오는 중...</Text>
      </Flex>
    );
  }

  if (!post) {
    return (
      <Flex className={s.loading_wrapper} align="center" justify="center">
        <Text className={s.loading_text}>포스트를 찾을 수 없습니다.</Text>
      </Flex>
    );
  }

  const formattedDate = new Date(post.data.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Helmet>
        <title>{post.data.title}</title>
      </Helmet>

      <div className={s.progress_bar}>
        <div ref={progressFillRef} className={s.progress_fill} />
      </div>

      <Header hideOnScroll logoHref="/blog" />

      <BaseLayout className={s.container}>
        <div className={s.body_layout}>
          <article className={s.article}>
            {/* 제목 */}
            <motion.div {...titleEntrance}>
              <Heading as="h1" size="3xl" className={s.title}>
                {post.data.title}
              </Heading>
            </motion.div>

            {/* 설명 + 메타 */}
            <motion.div {...metaEntrance}>
              {post.data.description && (
                <Text className={s.description}>{post.data.description}</Text>
              )}
              <Flex align="center" justify="space-between" className={s.meta}>
                <Flex align="center" gap={20}>
                  <Flex align="center" gap={6}>
                    <Calendar className={s.meta_icon} />
                    <Text className={s.meta_text}>{formattedDate}</Text>
                  </Flex>
                  <Flex align="center" gap={6}>
                    <Clock className={s.meta_icon} />
                    <Text className={s.meta_text}>3분 소요</Text>
                  </Flex>
                </Flex>
                <Flex gap={8}>
                  {post.data.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Flex>
              </Flex>
            </motion.div>

            {/* 썸네일 */}
            {post.data.thumbnail && (
              <motion.img
                src={post.data.thumbnail}
                alt={`${post.data.title} thumbnail`}
                className={s.thumbnail}
                {...thumbnailEntrance}
              />
            )}

            {/* 본문 */}
            <motion.section
              ref={contentRef}
              className={s.content}
              {...contentEntrance}
            >
              <MarkdownContent content={post.data.content || ""} />
            </motion.section>

            <Divider />

            <Giscus style={{ width: "100%" }} />
          </article>

          <aside className={s.toc_wrapper}>
            <TableOfContents
              contentRef={contentRef}
              content={post.data.content || ""}
            />
          </aside>
        </div>
      </BaseLayout>
    </>
  );
}
