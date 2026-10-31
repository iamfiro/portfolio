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
import {
  STACK_DATA,
  type StackCategory,
  type StackItem,
} from "@/shared/constants";

import s from "./style.module.scss";

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
          <Image
            src={icon}
            alt={name}
            objectFit="contain"
            className={iconClassName}
          />
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
