import { Component, Package, PersonStanding } from "lucide-react";
import { cloneElement, ReactElement, ReactNode, useMemo } from "react";

import { Flex, Image, Marquee, Text } from "@/shared/components/ui";

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
    <img src="/images/home/mind_blowing.gif" alt="mind_blowing.gif" className={s.ideaImage} />
  );
}

const stackIcons = [
  { src: "/icon/stack/typescript.svg", alt: "TypeScript" },
  { src: "/icon/stack/storybook.svg", alt: "Storybook" },
  { src: "/icon/stack/redis.svg", alt: "Redis" },
];

export function StackCard() {
  return (
    <FlowCard icon={<Component size={16} />} title="Tech Stack">
      <Marquee gradientColor="#0C0C0C" width={250} speed={15} gap={16} pauseOnHover showEdgeGradient={true}>
        {stackIcons.map((icon) => (
          <Image
            key={icon.alt}
            src={icon.src}
            alt={icon.alt}
            className={s.stackIcon}
          />
        ))}
      </Marquee>
    </FlowCard>
  );
}

export function ProductCard() {
  return (
    <img src="/images/home/happy-product.jpg" alt="happy_product.jpg" className={s.productImage} />
  );
}
