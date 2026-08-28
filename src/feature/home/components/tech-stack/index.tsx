import { motion } from "framer-motion";
import { useCallback } from "react";

import {
  Flex,
  Heading,
  HoverCard,
  HoverCardTrigger,
  Image,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface StackItem {
  name: string;
  icon: string;
  skills: string[];
  /** 흰색 단색 로고라 밝은 배경에서 반전이 필요한 아이콘 */
  invert?: boolean;
}

interface StackCategory {
  label: string;
  items: StackItem[];
}

const STACK_DATA: StackCategory[] = [
  {
    label: "프론트엔드",
    items: [
      {
        name: "TypeScript",
        icon: "/icon/stack/typescript.svg",
        skills: ["타입 안전한 대규모 앱 설계", "제네릭·유틸리티 타입 활용"],
      },
      {
        name: "React",
        icon: "/icon/stack/react.svg",
        skills: ["SPA·커스텀 훅 설계", "상태 관리 및 성능 최적화"],
      },
      {
        name: "Next.js",
        icon: "/icon/stack/nextjs.svg",
        skills: ["SSR/SSG 기반 웹 앱 구축", "App Router·서버 컴포넌트 활용"],
      },
      {
        name: "Sass",
        icon: "/icon/stack/sass.svg",
        skills: ["디자인 토큰 시스템 구축", "SCSS Modules 기반 스타일링"],
      },
      {
        name: "Storybook",
        icon: "/icon/stack/storybook.svg",
        skills: ["컴포넌트 문서화·시각적 테스트", "디자인 시스템 개발"],
      },
      {
        name: "Cypress",
        icon: "/icon/stack/cypress.svg",
        skills: ["E2E 테스트 자동화", "CI 파이프라인 통합 테스트"],
      },
      {
        name: "Jest",
        icon: "/icon/stack/jest.svg",
        skills: ["유닛·통합 테스트 작성", "모킹·스냅샷 테스트"],
      },
      {
        name: "ESLint",
        icon: "/icon/stack/eslint.svg",
        skills: ["커스텀 린트 규칙 설정", "코드 품질 자동화"],
      },
    ],
  },
  {
    label: "백엔드",
    items: [
      {
        name: "NestJS",
        icon: "/icon/stack/nestjs.svg",
        skills: ["모듈 기반 API 서버 설계", "DI·가드·인터셉터 활용"],
      },
      {
        name: "Express",
        icon: "/icon/stack/express.svg",
        invert: true,
        skills: ["REST API 서버 구축", "미들웨어 체인 설계"],
      },
      {
        name: "Prisma",
        icon: "/icon/stack/prisma.svg",
        invert: true,
        skills: ["타입 안전한 DB 쿼리", "마이그레이션·스키마 관리"],
      },
      {
        name: "MySQL",
        icon: "/icon/stack/mysql.svg",
        skills: ["관계형 DB 설계·최적화", "복잡한 쿼리·인덱싱"],
      },
      {
        name: "Redis",
        icon: "/icon/stack/redis.svg",
        skills: ["캐싱·세션 관리", "Pub/Sub 실시간 메시징"],
      },
      {
        name: "Socket.io",
        icon: "/icon/stack/socketdotio.svg",
        invert: true,
        skills: ["실시간 양방향 통신", "채팅·알림 시스템 구축"],
      },
    ],
  },
  {
    label: "애플리케이션",
    items: [
      {
        name: "Kotlin",
        icon: "/icon/stack/kotlin.svg",
        skills: ["Android 네이티브 앱 개발", "코루틴 기반 비동기 처리"],
      },
      {
        name: "Android",
        icon: "/icon/stack/android.svg",
        skills: ["Jetpack Compose UI", "Material Design 구현"],
      },
      {
        name: "Expo",
        icon: "/icon/stack/expo.svg",
        invert: true,
        skills: ["React Native 크로스플랫폼 앱", "OTA 업데이트·네이티브 모듈"],
      },
      {
        name: "Electron",
        icon: "/icon/stack/electron.svg",
        skills: ["데스크톱 앱 개발", "IPC 통신·시스템 연동"],
      },
    ],
  },
  {
    label: "기타",
    items: [
      {
        name: "GitHub Actions",
        icon: "/icon/stack/githubactions.svg",
        skills: ["CI/CD 파이프라인 구축", "자동 배포·테스트 워크플로"],
      },
      {
        name: "Notion",
        icon: "/icon/stack/notion.svg",
        invert: true,
        skills: ["프로젝트 문서화·관리", "팀 협업 워크스페이스 운영"],
      },
    ],
  },
];

function StackIcon({ name, icon, skills, invert }: StackItem) {
  const iconClassName = [s.icon, invert && s.iconInverted]
    .filter(Boolean)
    .join(" ");

  return (
    <HoverCardTrigger card={{ title: name, items: skills }}>
      <Flex align="center" justify="center" className={s.iconWrapper}>
        <Image src={icon} alt={name} className={iconClassName} />
      </Flex>
    </HoverCardTrigger>
  );
}

export default function TechStack() {
  const renderCategory = useCallback(
    (category: StackCategory, index: number) => (
      <motion.div
        key={category.label}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          delay: index * 0.08,
        }}
      >
        <Stack gap={12} className={s.category}>
          <Text size="sm" color="subtle" className={s.categoryLabel}>
            {category.label}
          </Text>
          <Flex gap={8} wrap className={s.iconGrid}>
            {category.items.map((item) => (
              <StackIcon key={item.name} {...item} />
            ))}
          </Flex>
        </Stack>
      </motion.div>
    ),
    [],
  );

  return (
    <Section className={s.techStack} size="sm">
      <Heading as="h2" size="lg" className={s.title}>
        기술 스택
      </Heading>

      <HoverCard className={s.categories}>
        {STACK_DATA.map(renderCategory)}
      </HoverCard>
    </Section>
  );
}
