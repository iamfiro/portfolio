import { useQueryClient } from "@tanstack/react-query";
import { Clock } from "lucide-react";

import { Post } from "@/feature/blog/schema";
import { Flex, Tag, Text } from "@/shared/components/ui";

import { getPost } from "../../api";

import BlogCardSkeleton from "./skeleton";

import s from "./style.module.scss";

interface BlogCardProps extends Post {
  isLoading?: boolean;
}

export default function BlogCard(props: BlogCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["post", props.title],
      queryFn: () => getPost(props.title),
    });
  };

  const {
    title,
    description,
    thumbnail,
    date,
    tags,
    isLoading = false,
  } = props;

  if (isLoading) {
    return <BlogCardSkeleton />;
  }

  return (
    <a
      href={`/blog/${title}`}
      className={s.card}
      onMouseEnter={handleMouseEnter}
    >
      <img src={thumbnail} alt={`${title} thumbnail`} className={s.thumbnail} />
      <Flex direction="column" gap={12}>
        <Flex gap={6} align="center">
          <Text size="xs" className={s.date}>
            {date.toLocaleDateString()}
          </Text>
          <Text size="xs" className={s.separator}>
            •
          </Text>
          <Flex gap={4} align="center">
            <Clock className={s.clock} />
            <Text size="xs" className={s.time}>
              3분 소요
            </Text>
          </Flex>
        </Flex>
        <Text size="xl" weight="semibold" className={s.name}>
          {title}
        </Text>
        <Text size="sm" className={s.description}>
          {description}
        </Text>
        <Flex gap={4}>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Flex>
      </Flex>
    </a>
  );
}
