import { useQuery } from "@tanstack/react-query";
import { Calendar, Hash } from "lucide-react";
import { useMemo, useState } from "react";

import { getPosts } from "@/feature/blog/api";
import { useBlogFilter } from "@/feature/blog/hooks";
import { PostsResponse } from "@/feature/blog/schema";
import {
  FlexAlign,
  FlexJustify,
  HStack,
  SearchBar,
  Select,
  Tag,
  TagSkeleton,
  Typo,
  VStack,
} from "@/shared/components/ui";

import BlogCard from "../card";
import BlogCardSkeleton from "../card/skeleton";

import s from "./style.module.scss";

export default function BlogArticleList() {
  const [sortBy, setSortBy] = useState("latest");

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const {
    allTags,
    finalFilteredPosts,
    searchQuery,
    toggleTag,
    isTagSelected,
    setQuery,
  } = useBlogFilter({ posts: posts?.data || [] });

  // 정렬된 포스트 목록
  const sortedPosts = useMemo(() => {
    if (!finalFilteredPosts) return [];

    return [...finalFilteredPosts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [finalFilteredPosts, sortBy]);

  if (error) {
    throw new Error("블로그 포스트를 불러오는 중 오류가 발생했습니다.");
  }

  return (
    <HStack gap={64} justify={FlexJustify.Between} fullWidth>
      <VStack gap={24} fullWidth>
        <SearchBar
          className={s.search_bar}
          value={searchQuery}
          onChange={setQuery}
          placeholder="글 검색하기..."
        />

        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => (
            <BlogCardSkeleton key={index} />
          ))
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
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
          <VStack gap={16} align={FlexAlign.Center} fullWidth>
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
          value={sortBy}
          onChange={setSortBy}
        />
        <section className={s.category_filter}>
          <Typo.BodyLarge className={s.category_filter_title}>
            <Hash /> 카테고리
          </Typo.BodyLarge>

          {isLoading ? (
            <HStack gap={6} wrap fullWidth>
              {Array.from({ length: 10 }, (_, index) => (
                <TagSkeleton key={index} />
              ))}
            </HStack>
          ) : (
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
          )}
        </section>
      </div>
    </HStack>
  );
}
