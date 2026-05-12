import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";

import { getPosts } from "@/feature/blog/api";
import { Post, PostsResponse } from "@/feature/blog/schema";
import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.1,
      }}
    >
      <a href={`/blog/${post.title}`} className={s.card}>
        <Flex
          justify="space-between"
          align="flex-start"
          className={s.cardInner}
        >
          <Stack gap={4} className={s.cardContent}>
            <Heading as="h3" size="lg" className={s.cardTitle}>
              {post.title}
            </Heading>
            <Text size="md" color="subtle" className={s.cardDescription}>
              {post.description}
            </Text>
          </Stack>
          <Flex align="center" gap={8} className={s.cardMeta}>
            <Text size="sm" color="subtle" className={s.cardDate}>
              {formatDate(post.date)}
            </Text>
            <ArrowUpRight size={16} className={s.cardArrow} />
          </Flex>
        </Flex>
      </a>
    </motion.div>
  );
}

export default function Blog() {
  const { data } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const posts = (data?.data ?? []).slice(0, 3);

  const renderPost = useCallback(
    (post: Post, index: number) => (
      <BlogCard key={post.id} post={post} index={index} />
    ),
    [],
  );

  return (
    <Section className={s.blog}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Heading as="h2" size="3xl" className={s.title}>
          Blog
        </Heading>
      </motion.div>

      <Stack gap={0} className={s.list}>
        {posts.map(renderPost)}
      </Stack>
    </Section>
  );
}
