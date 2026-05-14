import { useQuery } from "@tanstack/react-query";
import { Hash, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { getPosts } from "@/feature/blog/api";
import { useBlogFilter } from "@/feature/blog/hooks";
import { PostsResponse } from "@/feature/blog/schema";
import {
  BottomSheet,
  Flex,
  IconButton,
  SearchInput,
  Select,
  Skeleton,
  Tag,
  Text,
} from "@/shared/components/ui";
import { useMediaQuery } from "@/shared/hooks";

import BlogCard from "../card";
import BlogCardSkeleton from "../card/skeleton";

import s from "./style.module.scss";

export default function BlogArticleList() {
  const [sortBy, setSortBy] = useState("latest");
  const [filterOpen, setFilterOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const categoryPanel = (
    <section className={s.category_filter}>
      <Text size="lg" weight="semibold" className={s.category_filter_title}>
        <Hash /> 카테고리
      </Text>

      {isLoading ? (
        <Flex gap={6} wrap width="100%">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} width={60} height={32} />
          ))}
        </Flex>
      ) : (
        <Flex gap={6} wrap width="100%">
          {allTags.map((tag) => (
            <Tag
              key={tag}
              onClick={() => toggleTag(tag)}
              className={isTagSelected(tag) ? s.active_tag : ""}
            >
              {tag}
            </Tag>
          ))}
        </Flex>
      )}
    </section>
  );

  return (
    <Flex className={s.container} gap={64} justify="space-between" width="100%">
      <Flex direction="column" gap={24} width="100%">
        <Flex gap={8} align="center" width="100%">
          <SearchInput
            className={s.search_bar}
            value={searchQuery}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="글 검색하기..."
            fullWidth
          />
          {isMobile && (
            <IconButton
              aria-label="카테고리 필터 열기"
              className={s.filter_button}
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={18} />
            </IconButton>
          )}
        </Flex>

        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => (
            <BlogCardSkeleton key={index} />
          ))
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post, index) => (
            <BlogCard
              key={post.title}
              index={index}
              id={post.title}
              title={post.title}
              description={post.description}
              thumbnail={post.thumbnail}
              date={new Date(post.date)}
              tags={post.tags}
              content={post.content}
            />
          ))
        ) : (
          <Flex direction="column" gap={16} align="center" width="100%">
            <Text size="xl" weight="semibold">
              검색 결과가 없습니다
            </Text>
            <Text className={s.no_result_description}>
              다른 검색어나 태그를 시도해보세요
            </Text>
          </Flex>
        )}
      </Flex>

      {!isMobile && (
        <div className={s.right}>
          <Select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </Select>
          {categoryPanel}
        </div>
      )}

      <BottomSheet
        open={isMobile && filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <Flex direction="column" gap={20}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="semibold" className={s.bottom_sheet_label}>
              정렬
            </Text>
            <Select
              fullWidth
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </Select>
          </Flex>
          {categoryPanel}
        </Flex>
      </BottomSheet>
    </Flex>
  );
}
