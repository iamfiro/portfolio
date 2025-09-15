import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { getPost } from "@/feature/blog/api";
import { Giscus } from "@/feature/blog/components";
import { PostResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  Avatar,
  FlexAlign,
  HStack,
  MarkdownRenderer,
  Spacing,
  Tag,
  Typo,
  VStack,
} from "@/shared/components/ui";

import "@/shared/styles/markdown.scss";
import "@/shared/styles/prism-gh.scss";
import s from "./blog-article.module.scss";

type Post = NonNullable<PostResponse>;

export default function BlogArticle() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => getPost(id || ""),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{post.data.title}</title>
      </Helmet>
      <Spacing size={32} />
      <BaseLayout className={s.container}>
        <VStack className={s.content_container}>
          <VStack gap={16}>
            <Typo.Display as="h1" className={s.title}>
              {post.data.title}
            </Typo.Display>
            <HStack gap={8}>
              <Typo.Body className={s.description}>
                {new Date(post.data.date).toLocaleDateString()}
              </Typo.Body>
              <Typo.Body className={s.description}>•</Typo.Body>
              <HStack align={FlexAlign.Center} gap={4}>
                <Clock className={s.clock} />
                <Typo.Body className={s.description}>3분 소요</Typo.Body>
              </HStack>
            </HStack>
          </VStack>

          <div className={s.sub_header}>
            <HStack align={FlexAlign.Center} gap={12}>
              <Avatar
                src={"https://avatars.githubusercontent.com/u/72495729?v=4"}
                size={32}
              />
              <Typo.Body>Cho Sungju</Typo.Body>
            </HStack>
            <HStack gap={8}>
              {post.data.tags.map((tag) => (
                <Tag size="lg" key={tag}>
                  {tag}
                </Tag>
              ))}
            </HStack>
          </div>

          <img
            src={post.data.thumbnail}
            alt={`${post.data.title} thumbnail`}
            className={s.thumbnail}
          />

          <div className={"markdown_article"}>
            <MarkdownRenderer>{post.data.content || ""}</MarkdownRenderer>
          </div>
          <Giscus style={{ width: "100%" }} />
        </VStack>
      </BaseLayout>
    </>
  );
}
