import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

import { getPost } from "@/feature/blog/api";
import { Giscus } from "@/feature/blog/components";
import MarkdownContent from "@/feature/blog/components/markdown-content";
import { PostResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  Avatar,
  Divider,
  Flex,
  Header,
  Heading,
  IconButton,
  Tag,
  Text,
} from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./blog-article.module.scss";

type Post = NonNullable<PostResponse>;

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

export default function BlogArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const progress = useScrollProgress();

  const backEntrance = usePageEntrance("lead");
  const tagsEntrance = usePageEntrance("lead", 0.1);
  const titleEntrance = usePageEntrance("title");
  const metaEntrance = usePageEntrance("subtitle");
  const authorEntrance = usePageEntrance("body", -0.1);
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
        <div className={s.progress_fill} style={{ width: `${progress}%` }} />
      </div>

      <Header />

      <BaseLayout className={s.container}>
        <motion.div className={s.back_col} {...backEntrance}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className={s.back_button}
          >
            <ArrowLeft size={16} />
          </IconButton>
        </motion.div>

        <article className={s.article}>
          {/* 태그 */}
          <motion.div {...tagsEntrance}>
            <Flex gap={8} className={s.tags_row}>
              {post.data.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Flex>
          </motion.div>

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
            <Flex align="center" gap={20} className={s.meta}>
              <Flex align="center" gap={6}>
                <Calendar className={s.meta_icon} />
                <Text className={s.meta_text}>{formattedDate}</Text>
              </Flex>
              <Flex align="center" gap={6}>
                <Clock className={s.meta_icon} />
                <Text className={s.meta_text}>3분 소요</Text>
              </Flex>
            </Flex>
          </motion.div>

          {/* 구분선 + 작성자 */}
          <motion.div {...authorEntrance}>
            <Divider />
            <Flex align="center" gap={12} className={s.author}>
              <Avatar src="/sample_profile.jpg" size="sm" />
              <Flex direction="column" gap={2}>
                <Text className={s.author_name}>Cho Sungju</Text>
                <Text className={s.author_role}>Software Engineer</Text>
              </Flex>
            </Flex>
            <Divider />
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
          <motion.section className={s.content} {...contentEntrance}>
            <MarkdownContent content={post.data.content || ""} />
          </motion.section>

          <Divider />

          <Giscus style={{ width: "100%" }} />
        </article>
      </BaseLayout>
    </>
  );
}
