import { useCallback } from "react";

import {
  Flex,
  Heading,
  Image,
  Section,
  Stack,
  Text,
  Tooltip,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface StackItem {
  name: string;
  icon: string;
  skills: string[];
}

interface StackCategory {
  label: string;
  items: StackItem[];
}

const STACK_DATA: StackCategory[] = [
  {
    label: "FrontEnd",
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
    label: "Backend",
    items: [
      {
        name: "NestJS",
        icon: "/icon/stack/nestjs.svg",
        skills: ["모듈 기반 API 서버 설계", "DI·가드·인터셉터 활용"],
      },
      {
        name: "Express",
        icon: "/icon/stack/express.svg",
        skills: ["REST API 서버 구축", "미들웨어 체인 설계"],
      },
      {
        name: "Prisma",
        icon: "/icon/stack/prisma.svg",
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
        skills: ["실시간 양방향 통신", "채팅·알림 시스템 구축"],
      },
    ],
  },
  {
    label: "Application",
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
    label: "ETC",
    items: [
      {
        name: "GitHub Actions",
        icon: "/icon/stack/githubactions.svg",
        skills: ["CI/CD 파이프라인 구축", "자동 배포·테스트 워크플로"],
      },
      {
        name: "Notion",
        icon: "/icon/stack/notion.svg",
        skills: ["프로젝트 문서화·관리", "팀 협업 워크스페이스 운영"],
      },
    ],
  },
];

function StackIcon({ name, icon, skills }: StackItem) {
  const tooltipContent = (
    <Stack gap={4} className={s.tooltipContent}>
      <Text as="span" size="md" weight="semibold" className={s.tooltipTitle}>
        {name}
      </Text>
      {skills.map((skill) => (
        <Text as="span" size="sm" key={skill} className={s.tooltipSkill}>
          {skill}
        </Text>
      ))}
    </Stack>
  );

  return (
    <Tooltip content={tooltipContent} placement="top" delay={100}>
      <Flex align="center" justify="center" className={s.iconWrapper}>
        <Image src={icon} alt={name} className={s.icon} />
      </Flex>
    </Tooltip>
  );
}

export default function TechStack() {
  const renderCategory = useCallback(
    (category: StackCategory) => (
      <Stack gap={16} key={category.label} className={s.category}>
        <Text
          size="sm"
          weight="semibold"
          color="subtle"
          className={s.categoryLabel}
        >
          {category.label}
        </Text>
        <Flex gap={12} wrap className={s.iconGrid}>
          {category.items.map((item) => (
            <StackIcon key={item.name} {...item} />
          ))}
        </Flex>
      </Stack>
    ),
    [],
  );

  return (
    <Section className={s.techStack} size="md">
      <Heading as="h2" size="3xl" className={s.title}>
        Stack
      </Heading>

      <Stack gap={24} className={s.categories}>
        {STACK_DATA.map(renderCategory)}
      </Stack>
    </Section>
  );
}
