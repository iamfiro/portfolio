import { motion } from "framer-motion";

import type { Post } from "@/feature/blog/schema";
import { useLandingNavigate } from "@/feature/landing/hooks/use-landing-navigate";
import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Heading, Image, Link, Text } from "@/shared/components/ui";

import { formatPostDate } from "../blog.util";

import s from "./style.module.scss";

interface Props {
  post: Post;
  /** "featured"는 썸네일과 글을 좌우로 놓는 큰 카드 */
  variant?: "featured" | "compact";
}

export default function PostCard({ post, variant = "compact" }: Props) {
  const handleNavigate = useLandingNavigate();
  const cardClassName = [s.card, s[variant]].filter(Boolean).join(" ");

  return (
    <motion.article {...getRevealProps()}>
      <Link
        href={`/blog/${post.id}`}
        className={cardClassName}
        onClick={handleNavigate}
      >
        <Box className={s.media}>
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt=""
              className={s.image}
              loading="lazy"
              decoding="async"
            />
          )}
        </Box>

        <Box className={s.copy}>
          <Text as="span" className={s.date}>
            {formatPostDate(post.date)}
          </Text>
          <Heading as="h3" className={s.title}>
            {post.title}
          </Heading>
          {post.tags.length > 0 && (
            <Box className={s.tags}>
              {post.tags.map((tag) => (
                <Text as="span" key={tag} className={s.tag}>
                  {tag}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      </Link>
    </motion.article>
  );
}
