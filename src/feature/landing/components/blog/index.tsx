import { useMemo } from "react";

import type { Post } from "@/feature/blog/schema";
import { Box } from "@/shared/components/ui";

import SectionHead from "../section-head";

import { BLOG_HEADLINE_LINES, selectLandingPosts } from "./blog.util";
import PostCard from "./post-card";

import s from "./style.module.scss";

const TITLE_ID = "landing-blog-title";

interface Props {
  posts: Post[];
}

/** 최신 글은 크게, 그다음 글은 아래 두 열로 작게 놓는다 */
export default function LandingBlog({ posts }: Props) {
  const [featured, ...rest] = useMemo(() => selectLandingPosts(posts), [posts]);

  if (!featured) return null;

  return (
    <Box as="section" className={s.blog} aria-labelledby={TITLE_ID}>
      <SectionHead
        titleId={TITLE_ID}
        lines={BLOG_HEADLINE_LINES}
        link={{ href: "/blog", label: "전체 글 보기" }}
      />

      <Box className={s.body}>
        <PostCard post={featured} variant="featured" />

        {rest.length > 0 && (
          <Box className={s.rest}>
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
