import { useQuery } from "@tanstack/react-query";
import { Calendar, Hash } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { getPosts } from "@/feature/blog/api";
import { BlogCard } from "@/feature/blog/components";
import { useBlogFilter } from "@/feature/blog/hooks";
import { PostsResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  FlexAlign,
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
  const [searchParams] = useSearchParams();
  const { data: posts, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const {
    allTags,
    selectedTags,
    finalFilteredPosts,
    searchQuery,
    toggleTag,
    isTagSelected,
    setQuery,
  } = useBlogFilter({ posts: posts?.data || [] });

  // URL 파라미터에서 초기 태그 설정
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (
      tagParam &&
      allTags.includes(tagParam) &&
      !selectedTags.includes(tagParam)
    ) {
      toggleTag(tagParam);
    }
  }, [searchParams, allTags, selectedTags, toggleTag]);

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
        <VStack gap={24} fullWidth>
          <SearchBar
            className={s.search_bar}
            value={searchQuery}
            onChange={setQuery}
            placeholder="글 검색하기..."
          />

          {finalFilteredPosts.length > 0 ? (
            finalFilteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                thumbnail={post.thumbnail}
                date={new Date(post.date)}
                tags={post.tags}
              />
            ))
          ) : (
            <VStack
              gap={16}
              align={FlexAlign.Center}
              className={s.no_result}
              fullWidth
            >
              <Typo.Headline>검색 결과가 없습니다</Typo.Headline>
              <Typo.Body className={s.no_result_description}>
                다른 검색어나 태그를 시도해보세요
              </Typo.Body>
            </VStack>
          )}
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
              {allTags.map((tag) => (
                <Tag
                  key={tag}
                  size="lg"
                  onClick={() => toggleTag(tag)}
                  active={isTagSelected(tag)}
                >
                  {tag}
                </Tag>
              ))}
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
