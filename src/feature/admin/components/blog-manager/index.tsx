import { useMemo, useState } from "react";

import { Post } from "@/feature/blog/schema";
import {
  DataGrid,
  SearchInput,
  Select,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  posts: Post[];
}

type SortType = "latest" | "oldest";

export default function BlogManager({
  isLoading,
  posts,
  className,
  ...props
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortType, setSortType] = useState<SortType>("latest");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return ["all", ...Array.from(tags)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return posts
      .filter((post) => {
        const isTagMatched =
          selectedTag === "all" ? true : post.tags.includes(selectedTag);
        const isQueryMatched =
          loweredQuery.length === 0
            ? true
            : [post.title, post.description, post.tags.join(" ")]
                .join(" ")
                .toLowerCase()
                .includes(loweredQuery);

        return isTagMatched && isQueryMatched;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sortType === "latest" ? dateB - dateA : dateA - dateB;
      });
  }, [posts, query, selectedTag, sortType]);

  return (
    <Stack className={componentClassName} gap={16} {...props}>
      <Stack className={s.filterRow} gap={12}>
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
          placeholder="블로그 포스트 검색"
          fullWidth
        />
        <Select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value)}
        >
          {tagOptions.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption === "all" ? "전체 태그" : tagOption}
            </option>
          ))}
        </Select>
        <Select
          value={sortType}
          onChange={(event) => setSortType(event.target.value as SortType)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </Select>
      </Stack>

      <DataGrid
        data={filteredPosts}
        keyExtractor={(post) => post.id}
        emptyMessage={
          isLoading
            ? "포스트를 불러오는 중입니다."
            : "조회된 포스트가 없습니다."
        }
        columns={[
          {
            key: "title",
            header: "제목",
            render: (post) => <Text weight="medium">{post.title}</Text>,
          },
          {
            key: "date",
            header: "작성일",
            width: 160,
            render: (post) => (
              <Text color="subtle">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </Text>
            ),
          },
          {
            key: "tags",
            header: "태그",
            render: (post) => post.tags.join(", "),
          },
        ]}
      />
    </Stack>
  );
}
