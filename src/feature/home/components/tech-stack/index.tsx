import { motion } from "framer-motion";

import { useHomeSectionAnimation } from "@/feature/home/hooks";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";
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
    ],
  },
  {
    label: "백엔드",
    items: [
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
    ],
  },
];

const STACK_ITEM_COUNT = STACK_DATA.reduce(
  (count, category) => count + category.items.length,
  0,
);

interface StackIconProps extends StackItem {
  index: number;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

function StackIcon({
  icon,
  index,
  invert,
  isVisible,
  name,
  onAnimationComplete,
  skills,
}: StackIconProps) {
  const iconClassName = [s.icon, invert && s.iconInverted]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={HOME_ANIMATION_HIDDEN}
      animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
      transition={getHomeAnimationTransition(index + 1)}
      onAnimationComplete={onAnimationComplete}
    >
      <HoverCardTrigger card={{ title: name, items: skills }}>
        <Flex align="center" justify="center" className={s.iconWrapper}>
          <Image src={icon} alt={name} className={iconClassName} />
        </Flex>
      </HoverCardTrigger>
    </motion.div>
  );
}

export default function TechStack() {
  const { complete, isVisible, ref } = useHomeSectionAnimation({
    id: "tech-stack",
    order: 4,
  });

  const renderCategory = (category: StackCategory, categoryIndex: number) => {
    const itemOffset = STACK_DATA.slice(0, categoryIndex).reduce(
      (count, previousCategory) => count + previousCategory.items.length,
      0,
    );

    return (
      <motion.div
        key={category.label}
        initial={HOME_ANIMATION_HIDDEN}
        animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
        transition={getHomeAnimationTransition(itemOffset)}
      >
        <Stack gap={12} className={s.category}>
          <Text size="sm" color="subtle" className={s.categoryLabel}>
            {category.label}
          </Text>
          <Flex gap={8} wrap className={s.iconGrid}>
            {category.items.map((item, itemIndex) => {
              const index = itemOffset + itemIndex;

              return (
                <StackIcon
                  key={item.name}
                  {...item}
                  index={index}
                  isVisible={isVisible}
                  onAnimationComplete={
                    index === STACK_ITEM_COUNT - 1 ? complete : undefined
                  }
                />
              );
            })}
          </Flex>
        </Stack>
      </motion.div>
    );
  };

  return (
    <motion.div ref={ref}>
      <Section className={s.techStack} size="sm">
        <motion.div
          initial={HOME_ANIMATION_HIDDEN}
          animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
          transition={getHomeAnimationTransition()}
        >
          <Heading as="h2" size="lg" className={s.title}>
            기술 스택
          </Heading>
        </motion.div>

        <HoverCard className={s.categories}>
          {STACK_DATA.map(renderCategory)}
        </HoverCard>
      </Section>
    </motion.div>
  );
}
