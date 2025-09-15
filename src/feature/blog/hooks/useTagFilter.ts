import { useState, useMemo } from "react";
import { Post } from "@/feature/blog/schema";

interface UseTagFilterProps {
  posts: Post[];
}

export function useTagFilter({ posts }: UseTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 모든 포스트에서 고유한 태그들을 추출
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // 선택된 태그들로 필터링된 포스트들
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return posts;
    }
    return posts.filter((post) =>
      selectedTags.every((tag) => post.tags.includes(tag))
    );
  }, [posts, selectedTags]);

  // 태그 토글 함수
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // 태그 선택 해제
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // 모든 태그 선택 해제
  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // 태그가 선택되어 있는지 확인
  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  return {
    allTags,
    selectedTags,
    filteredPosts,
    toggleTag,
    removeTag,
    clearAllTags,
    isTagSelected,
  };
}


