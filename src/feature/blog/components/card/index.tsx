import { Clock } from "lucide-react";

import { FlexAlign, HStack, Typo, VStack } from "@/shared/components/ui";
import Tag from "@/shared/components/ui/tag";
import { BlogSummary } from "@/shared/types/blog";

import s from "./style.module.scss";

export default function BlogCard(props: BlogSummary) {
  const { id, name, description, thumbnail, date, tags } = props;
  return (
    <a href={`/blog/${id}`} className={s.card}>
      <img src={thumbnail} alt={`${name} thumbnail`} className={s.thumbnail} />
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
        <Typo.Headline className={s.name}>{name}</Typo.Headline>
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
