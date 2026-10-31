import { LINK } from "@/shared/constants";

import type { HeroBlob } from "../hero/hero.type";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  label: string;
  links: FooterLink[];
}

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    label: "둘러보기",
    links: [
      { label: "프로젝트", href: "/projects" },
      { label: "활동", href: "/activities" },
      { label: "블로그", href: "/blog" },
      { label: "이력서", href: "/resume" },
    ],
  },
  {
    label: "소셜",
    links: [
      { label: "GitHub", href: LINK.github, external: true },
      { label: "LinkedIn", href: LINK.linkedin, external: true },
    ],
  },
];

export type CrowdSize = "sm" | "md" | "lg";

/** 푸터 바닥에서 고개를 내밀고 배웅하는 스마일 한 마리 */
export interface CrowdMember
  extends Pick<HeroBlob, "shape" | "tone" | "face" | "rotate"> {
  id: string;
  size: CrowdSize;
  /** 좁은 화면에선 줄을 줄여 몇 마리만 남긴다 */
  hideOnMobile?: boolean;
}

// 어두운 바탕이라 검은 몸통은 빼고, 히어로의 덩어리들이 다시 모인 것처럼 섞는다
export const FOOTER_CROWD: CrowdMember[] = [
  {
    id: "pink",
    shape: "squircle",
    tone: "pink",
    face: "happy",
    rotate: -10,
    size: "lg",
  },
  {
    id: "yellow",
    shape: "arch",
    tone: "yellow",
    face: "dot",
    rotate: 4,
    size: "md",
    hideOnMobile: true,
  },
  {
    id: "brand",
    shape: "circle",
    tone: "brand",
    face: "wink",
    rotate: 8,
    size: "lg",
  },
  {
    id: "green",
    shape: "squircle",
    tone: "green",
    face: "dot",
    rotate: -6,
    size: "sm",
    hideOnMobile: true,
  },
  {
    id: "sunset",
    shape: "circle",
    tone: "sunset",
    face: "dot",
    rotate: 0,
    size: "lg",
  },
  {
    id: "purple",
    shape: "blossom",
    tone: "purple",
    face: "happy",
    rotate: 12,
    size: "md",
  },
  {
    id: "blue",
    shape: "squircle",
    tone: "blue",
    face: "wink",
    rotate: -8,
    size: "lg",
    hideOnMobile: true,
  },
];
