import { Clock } from "lucide-react";

import { BaseLayout } from "@/shared/components/layouts";
import {
  Avatar,
  FlexAlign,
  FlexJustify,
  HStack,
  Spacing,
  Tag,
  Typo,
  VStack,
} from "@/shared/components/ui";

import s from "./blog-article.module.scss";

export default function BlogArticle() {
  return (
    <>
      <Spacing size={32} />
      <BaseLayout className={s.container}>
        <VStack className={s.content_container}>
          <VStack gap={16}>
            <Typo.Display className={s.title}>
              OpenSearch Analyzer를 활용한 검색기능 알아보기
            </Typo.Display>
            <HStack gap={8}>
              <Typo.Body className={s.description}>2025-09-13</Typo.Body>
              <Typo.Body className={s.description}>•</Typo.Body>
              <HStack align={FlexAlign.Center} gap={4}>
                <Clock className={s.clock} />
                <Typo.Body className={s.description}>3분 소요</Typo.Body>
              </HStack>
            </HStack>
          </VStack>

          <div className={s.sub_header}>
            <HStack align={FlexAlign.Center} gap={12}>
              <Avatar src="/sample_profile.jpg" size={32} />
              <Typo.Body>Cho Sungju</Typo.Body>
            </HStack>
            <HStack gap={8}>
              <Tag size="lg">OpenSearch</Tag>
              <Tag size="lg">Analyzer</Tag>
              <Tag size="lg">Search</Tag>
            </HStack>
          </div>

          <img
            src="/sample_thumbnail.png"
            alt="thumbnail"
            className={s.thumbnail}
          />
        </VStack>
      </BaseLayout>
    </>
  );
}
