import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import { Post } from "@/feature/blog/schema";
import { Flex, Tag, Text } from "@/shared/components/ui";

import { getPost } from "../../api";

import { calculateReadingTime } from "./reading-time.util";
import BlogCardSkeleton from "./skeleton";

import s from "./style.module.scss";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface BlogCardProps extends Post {
  index?: number;
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
    content,
    index = 0,
    isLoading = false,
  } = props;

  const readingTime = content ? calculateReadingTime(content) : null;

  if (isLoading) {
    return <BlogCardSkeleton />;
  }

  return (
    <motion.a
      href={`/blog/${title}`}
      className={s.card}
      onMouseEnter={handleMouseEnter}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 }}
    >
      <div className={s.thumbnailWrapper}>
        <motion.img
          src={thumbnail}
          alt={`${title} thumbnail`}
          className={s.thumbnail}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>
      <Flex direction="column" gap={12}>
        <Flex gap={6} align="center">
          <Text size="xs" className={s.date}>
            {date.toLocaleDateString()}
          </Text>
          {readingTime !== null && (
            <>
              <Text size="xs" className={s.separator}>
                •
              </Text>
              <Flex gap={4} align="center">
                <Clock className={s.clock} />
                <Text size="xs" className={s.time}>
                  {readingTime}분 소요
                </Text>
              </Flex>
            </>
          )}
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
    </motion.a>
  );
}
