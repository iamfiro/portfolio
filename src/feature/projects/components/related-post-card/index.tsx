import { RelatedPost } from "@/feature/projects/schema";
import { Card, Flex, Link, Stack, Tag, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  post: RelatedPost;
}

export default function RelatedPostCard({ post }: Props) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/blog/${encodeURIComponent(post.title)}`} className={s.component}>
      <Card variant="filled" hoverable className={s.card}>
        <Stack gap={6}>
          <Text className={s.title}>{post.title}</Text>
          {post.description ? (
            <Text size="sm" color="subtle">
              {post.description}
            </Text>
          ) : null}
          {formattedDate ? (
            <Text size="xs" color="subtle">
              {formattedDate}
            </Text>
          ) : null}
          {post.tags && post.tags.length > 0 ? (
            <Flex gap={4} wrap>
              {post.tags.map((tag) => (
                <Tag key={tag} size="sm">
                  {tag}
                </Tag>
              ))}
            </Flex>
          ) : null}
        </Stack>
      </Card>
    </Link>
  );
}
