import { LINK } from "@/shared/constants";

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
