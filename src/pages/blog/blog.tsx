import { Calendar, Hash } from "lucide-react";

import { BlogCard } from "@/feature/blog";
import { BaseLayout } from "@/shared/components/layouts";
import {
  FlexJustify,
  HStack,
  SearchBar,
  Select,
  Tag,
  Typo,
  VStack,
} from "@/shared/components/ui";

import s from "./blog.module.scss";

export default function Blog() {
  return (
    <BaseLayout>
      <div aria-label="spacer" />
      <div className={s.thumbnail}>
        <div>
          <img src="/icon/folder.png" className={s.thumbnail_icon_lt} />
          <img src="/icon/book.png" className={s.thumbnail_icon_rt} />
        </div>

        <h1 className={s.title}>
          A space to record my <img src="/icon/air-balloon.png" /> journey,
          <br /> <img src="/icon/pencil.png" />
          learn, and <img src="/icon/pacman.png" /> share
        </h1>

        <div>
          <img src="/icon/telescope.png" className={s.thumbnail_icon_lb} />
          <img src="/icon/lab.png" className={s.thumbnail_icon_rb} />
        </div>
      </div>
      <HStack gap={64} justify={FlexJustify.Between} fullWidth>
        <VStack gap={24}>
          <SearchBar className={s.search_bar} />
          {Array.from({ length: 10 }).map(() => (
            <BlogCard
              id="1"
              name="OpenSearch Analyzer를 활용한 검색기능 알아보기"
              description="OpenSearch Analyzer를 활용한 검색 서비스를 간단한 예제와 함께 알아봅니다."
              thumbnail="/sample_thumbnail.png"
              date={new Date()}
              tags={["AI", "OpenSearch", "Elasticsearch"]}
            />
          ))}
        </VStack>
        <div className={s.right}>
          <Select
            fullWidth
            icon={Calendar}
            options={[
              {
                value: "latest",
                label: "최신순",
                description: "최신 항목부터 표시 합니다.",
              },
              {
                value: "oldest",
                label: "오래된순",
                description: "오래된 항목부터 표시 합니다.",
              },
            ]}
            value="latest"
          />
          <section className={s.category_filter}>
            <Typo.BodyLarge className={s.category_filter_title}>
              <Hash /> 카테고리
            </Typo.BodyLarge>

            <HStack gap={6} wrap fullWidth>
              <Tag size="lg">Next.js</Tag>
              <Tag size="lg">React</Tag>
              <Tag size="lg">TypeScript</Tag>
              <Tag size="lg">Tailwind CSS</Tag>
              <Tag size="lg">Node.js</Tag>
              <Tag size="lg">Express</Tag>
              <Tag size="lg">MongoDB</Tag>
              <Tag size="lg">PostgreSQL</Tag>
              <Tag size="lg">Redis</Tag>
              <Tag size="lg">Docker</Tag>
              <Tag size="lg">Kubernetes</Tag>
              <Tag size="lg">AWS</Tag>
              <Tag size="lg">GCP</Tag>
            </HStack>
          </section>
        </div>
      </HStack>
      <Typo.Subtext className={s.copyright}>
        ⓒ {new Date().getFullYear()}. Cho Sungju All rights reserved.
      </Typo.Subtext>
    </BaseLayout>
  );
}
