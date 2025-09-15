import { Clock } from "lucide-react";

import { Post } from "@/feature/blog/schema";
import { FlexAlign, HStack, Tag, Typo, VStack } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function BlogCard(props: Post) {
  const { title, description, thumbnail, date, tags } = props;
  return (
    <a href={`/blog/${title}`} className={s.card}>
      <img src={thumbnail} alt={`${title} thumbnail`} className={s.thumbnail} />
      <VStack gap={12}>
        <HStack gap={6} align={FlexAlign.Center}>
          <Typo.Caption className={s.date}>
            {date.toLocaleDateString()}
          </Typo.Caption>
          <Typo.Caption className={s.separator}>•</Typo.Caption>
          <HStack gap={4} align={FlexAlign.Center}>
            <Clock className={s.clock} />
            <Typo.Caption className={s.time}>3분 소요</Typo.Caption>
          </HStack>
        </HStack>
        <Typo.Headline className={s.name}>{title}</Typo.Headline>
        <Typo.Subtext className={s.description}>{description}</Typo.Subtext>
        <HStack gap={4}>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </HStack>
      </VStack>
    </a>
  );
}
