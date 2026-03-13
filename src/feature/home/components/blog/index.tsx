import { useCallback } from "react";

import { ArrowUpRight } from "lucide-react";

import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  url: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "React 19의 새로운 기능 정리",
    description:
      "use 훅, 서버 컴포넌트 등 React 19에서 달라진 점을 살펴봅니다.",
    date: "2025.12",
    url: "#",
  },
  {
    id: 2,
    title: "디자인 토큰으로 일관된 UI 만들기",
    description:
      "SCSS 변수 기반 디자인 토큰 시스템을 구축한 경험을 공유합니다.",
    date: "2025.10",
    url: "#",
  },
  {
    id: 3,
    title: "TypeScript 제네릭 실전 활용법",
    description:
      "컴포넌트와 유틸리티 함수에서 제네릭을 효과적으로 사용하는 방법.",
    date: "2025.08",
    url: "#",
  },
];

function BlogCard({ title, description, date, url }: Omit<BlogPost, "id">) {
  return (
    <a href={url} className={s.card} target="_blank" rel="noopener noreferrer">
      <Flex justify="space-between" align="flex-start" className={s.cardInner}>
        <Stack gap={4} className={s.cardContent}>
          <Heading as="h3" size="lg" className={s.cardTitle}>
            {title}
          </Heading>
          <Text size="md" color="subtle" className={s.cardDescription}>
            {description}
          </Text>
        </Stack>
        <Flex align="center" gap={8} className={s.cardMeta}>
          <Text size="sm" color="subtle" className={s.cardDate}>
            {date}
          </Text>
          <ArrowUpRight size={16} className={s.cardArrow} />
        </Flex>
      </Flex>
    </a>
  );
}

export default function Blog() {
  const renderPost = useCallback(
    (post: BlogPost) => (
      <BlogCard
        key={post.id}
        title={post.title}
        description={post.description}
        date={post.date}
        url={post.url}
      />
    ),
    [],
  );

  return (
    <Section className={s.blog}>
      <Heading as="h2" size="3xl" className={s.title}>
        Blog
      </Heading>

      <Stack gap={0} className={s.list}>
        {BLOG_POSTS.map(renderPost)}
      </Stack>
    </Section>
  );
}
