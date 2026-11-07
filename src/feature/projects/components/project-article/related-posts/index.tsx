import { ArrowUpRight } from "lucide-react";

import { useLandingNavigate } from "@/feature/landing/hooks/use-landing-navigate";
import type { RelatedPost } from "@/feature/projects/schema";
import { Box, Link, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  posts: RelatedPost[];
}

function formatDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** 관련 글을 옅은 타일로 늘어놓는다 */
export default function RelatedPosts({ posts }: Props) {
  const handleNavigate = useLandingNavigate();

  return (
    <Box className={s.list}>
      {posts.map((post, index) => (
        <Reveal key={post.title} index={index + 1}>
          <Link
            href={`/blog/${post.title}`}
            className={s.tile}
            onClick={handleNavigate}
          >
            <Box className={s.copy}>
              <Text as="span" className={s.title}>
                {post.description ?? post.title}
              </Text>
              {post.date && (
                <Text as="span" className={s.date}>
                  {formatDate(post.date)}
                </Text>
              )}
            </Box>
            <Box as="span" className={s.arrow} aria-hidden>
              <ArrowUpRight size={20} />
            </Box>
          </Link>
        </Reveal>
      ))}
    </Box>
  );
}
