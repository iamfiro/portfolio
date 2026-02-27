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
  Flex,
  Header,
  Heading,
  Spacer,
  Tag,
  Text,
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
      <Header />
      <Spacer size={48} />
      <BaseLayout className={s.container}>
        <Flex direction="column" className={s.content_container}>
          <Flex direction="column" gap={16}>
            <Heading as="h1" size="4xl" className={s.title}>
              {post.data.title}
            </Heading>
            <Flex gap={8}>
              <Text className={s.description}>
                {new Date(post.data.date).toLocaleDateString()}
              </Text>
              <Text className={s.description}>•</Text>
              <Flex align="center" gap={4}>
                <Clock className={s.clock} />
                <Text className={s.description}>3분 소요</Text>
              </Flex>
            </Flex>
          </Flex>

          <div className={s.sub_header}>
            <Flex align="center" gap={12}>
              <Avatar src="/sample_profile.jpg" size="sm" />
              <Text>Cho Sungju</Text>
            </Flex>
            <Flex gap={8}>
              {post.data.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Flex>
          </div>

          <img
            src={post.data.thumbnail}
            alt={`${post.data.title} thumbnail`}
            className={s.thumbnail}
          />

          <div
            className="markdown_article"
            dangerouslySetInnerHTML={{ __html: post.data.content || "" }}
          />
          <Giscus style={{ width: "100%" }} />
        </Flex>
      </BaseLayout>
    </>
  );
}
