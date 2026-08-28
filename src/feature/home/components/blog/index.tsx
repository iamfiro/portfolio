import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";

import { getPosts } from "@/feature/blog/data";
import { Post, PostsResponse } from "@/feature/blog/schema";
import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function BlogCard({ post }: { post: Post }) {
  return (
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
          <Text as="span" size="sm" color="subtle" className={s.description}>
            {post.description}
          </Text>
        </Text>
        <Text size="sm" color="subtle" className={s.date}>
          {formatDate(post.date)}
        </Text>
      </Flex>
    </a>
  );
}

export default function Blog() {
  const { data } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const posts = (data?.data ?? []).slice(0, 3);

  const renderPost = useCallback(
    (post: Post) => <BlogCard key={post.id} post={post} />,
    [],
  );

  return (
    <Section className={s.blog} size="sm">
      <Heading as="h2" size="lg" className={s.title}>
        블로그
      </Heading>

      <Stack className={s.list} gap={20}>
        {posts.map(renderPost)}
      </Stack>
    </Section>
  );
}
