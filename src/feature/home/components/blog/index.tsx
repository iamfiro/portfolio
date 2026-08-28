import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

import { getPosts } from "@/feature/blog/data";
import { useHomeSectionAnimation } from "@/feature/home/hooks";
import { Post, PostsResponse } from "@/feature/blog/schema";
import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";

import s from "./style.module.scss";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

interface BlogCardProps {
  index: number;
  isVisible: boolean;
  onAnimationComplete?: () => void;
  post: Post;
}

function BlogCard({
  index,
  isVisible,
  onAnimationComplete,
  post,
}: BlogCardProps) {
  return (
    <motion.div
      initial={HOME_ANIMATION_HIDDEN}
      animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
      transition={getHomeAnimationTransition(index + 1)}
      onAnimationComplete={onAnimationComplete}
    >
      <a href={`/blog/${post.id}`} className={s.card}>
        <Flex align="baseline" gap={12} className={s.item}>
          <Text as="p" className={s.content}>
            <Text as="span" className={s.titleRow}>
              <Text as="span" className={s.cardTitle}>
                {post.title}
              </Text>
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className={s.arrow}
                aria-hidden="true"
              />
            </Text>
            <Text
              as="span"
              size="sm"
              color="subtle"
              className={s.description}
            >
              {post.description}
            </Text>
          </Text>
          <Text size="sm" color="subtle" className={s.date}>
            {formatDate(post.date)}
          </Text>
        </Flex>
      </a>
    </motion.div>
  );
}

export default function Blog() {
  const { complete, isVisible, ref } = useHomeSectionAnimation({
    id: "blog",
    order: 5,
  });
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const posts = (data?.data ?? []).slice(0, 3);

  useEffect(() => {
    if (!isVisible || isLoading || posts.length > 0) return;

    complete();
  }, [complete, isLoading, isVisible, posts.length]);

  return (
    <motion.div ref={ref}>
      <Section className={s.blog} size="sm">
        <motion.div
          initial={HOME_ANIMATION_HIDDEN}
          animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
          transition={getHomeAnimationTransition()}
        >
          <Heading as="h2" size="lg" className={s.title}>
            블로그
          </Heading>
        </motion.div>

        <Stack className={s.list} gap={20}>
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              index={index}
              isVisible={isVisible}
              onAnimationComplete={
                index === posts.length - 1 ? complete : undefined
              }
              post={post}
            />
          ))}
        </Stack>
      </Section>
    </motion.div>
  );
}
