import { Post } from "@/feature/blog/schema";

import { useSearch } from "./useSearch";
import { useTagFilter } from "./useTagFilter";

interface UseBlogFilterProps {
  posts: Post[];
}

export function useBlogFilter({ posts }: UseBlogFilterProps) {
  const tagFilter = useTagFilter({ posts });
  const search = useSearch({ posts: tagFilter.filteredPosts });

  // 최종 필터링된 포스트들 (태그 필터링 + 검색)
  const finalFilteredPosts = search.filteredPosts;

  // 필터가 적용되었는지 확인
  const hasActiveFilters =
    tagFilter.selectedTags.length > 0 || search.searchQuery.trim() !== "";

  // 모든 필터 초기화
  const clearAllFilters = () => {
    tagFilter.clearAllTags();
    search.clearQuery();
  };

  return {
    ...tagFilter,
    ...search,
    finalFilteredPosts,
    hasActiveFilters,
    clearAllFilters,
  };
}


