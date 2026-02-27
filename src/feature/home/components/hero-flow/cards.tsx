import { Box, Code, Component, Layers, Lightbulb, Package, Palette, PersonStanding, Zap } from "lucide-react";
import { cloneElement, ReactElement, ReactNode, useMemo } from "react";

import { Flex, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface FlowCardProps {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
}

export function FlowCard({ icon, title, children }: FlowCardProps) {
  const clonedIcon = useMemo(
    () => icon ? cloneElement(icon as ReactElement, { className: s.cardIcon }) : null,
    [icon]
  );
  const hasHeader = icon || title;

  return (
    <Flex direction="column" gap={12} className={s.cardContent}>
      {hasHeader && (
        <Flex align="center" gap={4}>
          {clonedIcon}
          {title && <span className={s.cardTitle}>{title}</span>}
        </Flex>
      )}
      {children && <Flex className={s.cardChildren}>{children}</Flex>}
    </Flex>
  );
}

export function PersonCard() {
  return (
    <FlowCard icon={<PersonStanding size={16} />} title="Person">
      <ul className={s.personCardList}>
        <li>
          <span>Name</span>
          <span>Cho Sungju</span>
        </li>
        <li>
          <span>Age</span>
          <span>18</span>
        </li>
        <li>
          <span>Current</span>
          <span>Sunrin Internet High School</span>
        </li>
        <li>
          <span>Name</span>
          <span>Cho Sungju</span>
        </li>
      </ul>
    </FlowCard>
  );
}

export function IdeaCard() {
  return (
    <FlowCard>
      <img src="/images/home/mind_blowing.gif" alt="mind_blowing.gif" className={s.ideaImage} />
    </FlowCard>
  );
}

export function StackCard() {
  return (
    <FlowCard icon={<Component size={16} />} title="Stack">
      <Flex gap={6} align="center">
        <span className={s.colorDot} style={{ backgroundColor: "#FF6B6B" }} />
        <span className={s.colorDot} style={{ backgroundColor: "#4ECDC4" }} />
        <span className={s.colorDot} style={{ backgroundColor: "#45B7D1" }} />
        <span className={s.colorDot} style={{ backgroundColor: "#96CEB4" }} />
      </Flex>
    </FlowCard>
  );
}

export function ProductCard() {
  return (
    <FlowCard icon={<Package size={16} />} title="Product">
      <Text size="xs" color="subtle">
        Amazing Result
      </Text>
    </FlowCard>
  );
}
