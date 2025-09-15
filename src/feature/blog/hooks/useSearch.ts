import { useState, useMemo } from "react";
import { Post } from "@/feature/blog/schema";

interface UseSearchProps {
  posts: Post[];
}

export function useSearch({ posts }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색어로 필터링된 포스트들
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      const description = post.description.toLowerCase();
      const tags = post.tags.join(" ").toLowerCase();
      
      return (
        title.includes(query) ||
        description.includes(query) ||
        tags.includes(query)
      );
    });
  }, [posts, searchQuery]);

  // 검색어 설정
  const setQuery = (query: string) => {
    setSearchQuery(query);
  };

  // 검색어 초기화
  const clearQuery = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    filteredPosts,
    setQuery,
    clearQuery,
  };
}


