import { useQuery } from "@tanstack/react-query";
import { Calendar, Hash } from "lucide-react";

import { getPosts } from "@/feature/blog/api";
import { BlogCard } from "@/feature/blog/components";
import { PostsResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  FlexJustify,
  HStack,
  SearchBar,
  Select,
  Tag,
  Typo,
  VStack,
} from "@/shared/components/ui";

import s from "./blog.module.scss";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  console.log(posts);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!posts) {
    return <div>No posts found</div>;
  }

  return (
    <BaseLayout>
      <div aria-label="spacer" />
      <div className={s.thumbnail}>
        <div>
          <img src="/icon/folder.png" className={s.thumbnail_icon_lt} />
          <img src="/icon/book.png" className={s.thumbnail_icon_rt} />
        </div>

        <h1 className={s.title}>
          A space to record my <img src="/icon/air-balloon.png" /> journey,
          <br /> <img src="/icon/pencil.png" />
          learn, and <img src="/icon/pacman.png" /> share
        </h1>

        <div>
          <img src="/icon/telescope.png" className={s.thumbnail_icon_lb} />
          <img src="/icon/lab.png" className={s.thumbnail_icon_rb} />
        </div>
      </div>
      <HStack gap={64} justify={FlexJustify.Between} fullWidth>
        <VStack gap={24}>
          <SearchBar className={s.search_bar} />
          {posts.data.map((post) => (
            <BlogCard
              id={post.id}
              title={post.title}
              description={post.description}
              thumbnail={post.thumbnail}
              date={new Date(post.date)}
              tags={post.tags}
            />
          ))}
        </VStack>
        <div className={s.right}>
          <Select
            fullWidth
            icon={Calendar}
            options={[
              {
                value: "latest",
                label: "최신순",
                description: "최신 항목부터 표시 합니다.",
              },
              {
                value: "oldest",
                label: "오래된순",
                description: "오래된 항목부터 표시 합니다.",
              },
            ]}
            value="latest"
          />
          <section className={s.category_filter}>
            <Typo.BodyLarge className={s.category_filter_title}>
              <Hash /> 카테고리
            </Typo.BodyLarge>

            <HStack gap={6} wrap fullWidth>
              <Tag size="lg">Next.js</Tag>
              <Tag size="lg">React</Tag>
              <Tag size="lg">TypeScript</Tag>
              <Tag size="lg">Tailwind CSS</Tag>
              <Tag size="lg">Node.js</Tag>
              <Tag size="lg">Express</Tag>
              <Tag size="lg">MongoDB</Tag>
              <Tag size="lg">PostgreSQL</Tag>
              <Tag size="lg">Redis</Tag>
              <Tag size="lg">Docker</Tag>
              <Tag size="lg">Kubernetes</Tag>
              <Tag size="lg">AWS</Tag>
              <Tag size="lg">GCP</Tag>
            </HStack>
          </section>
        </div>
      </HStack>
      <Typo.Subtext className={s.copyright}>
        ⓒ {new Date().getFullYear()}. Cho Sungju All rights reserved.
      </Typo.Subtext>
    </BaseLayout>
  );
}
