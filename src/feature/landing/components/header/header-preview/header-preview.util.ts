import { LINK } from "@/shared/constants";
import {
  contentActivities,
  contentAwards,
  contentPosts,
  contentProjects,
} from "@/shared/content/content";

import type { PreviewContent, PreviewKey } from "./header-preview.type";

// 패널 카드 그리드가 4열이라 한 줄을 넘기지 않는다
export const CARD_LIMIT = 4;

const toTime = (value: string | Date) => new Date(value).getTime();

function formatYearMonth(value: string | Date) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}.${month}`;
}

function buildProjects(): PreviewContent {
  const items = [...contentProjects]
    .sort((a, b) => toTime(b.startDate) - toTime(a.startDate))
    .slice(0, CARD_LIMIT)
    .map((project) => ({
      id: project.id,
      title: project.title,
      meta: project.description,
      href: `/projects/${project.id}`,
      imageUrl: project.thumbnailUrl,
      highlight: project.title,
    }));

  return {
    layout: "cards",
    eyebrow: "프로젝트",
    description: "불편함에서 출발해\n직접 기획하고 만든 서비스",
    total: contentProjects.length,
    items,
    more: { label: "프로젝트 전체 보기", href: "/projects" },
  };
}

// 활동 페이지는 수상과 대외 활동을 함께 보여주므로 둘을 섞어 최신순으로 자른다
function buildActivities(): PreviewContent {
  // 수상은 따로 볼 페이지가 없어 활동 페이지로, 기사·계정이 있는 활동은 그 링크로 바로 연다
  const awards = contentAwards.map((award) => ({
    id: `award-${award.id}`,
    title: award.title,
    meta: award.organization,
    date: award.date,
    href: "/activities",
    external: false,
  }));
  const activities = contentActivities.map((activity) => ({
    id: `activity-${activity.id}`,
    title: activity.title,
    meta: activity.description,
    date: activity.date,
    href: activity.href ?? "/activities",
    external: !!activity.href,
  }));

  const items = [...awards, ...activities]
    .sort((a, b) => toTime(b.date) - toTime(a.date))
    .slice(0, CARD_LIMIT)
    .map(({ id, title, meta, date, href, external }) => ({
      id,
      title,
      meta,
      href,
      external,
      highlight: formatYearMonth(date),
    }));

  return {
    layout: "rows",
    eyebrow: "활동",
    description: "대회와 커뮤니티에서\n쌓아온 기록",
    total: awards.length + activities.length,
    items,
    more: { label: "활동 전체 보기", href: "/activities" },
  };
}

function buildBlog(): PreviewContent {
  const items = [...contentPosts]
    .sort((a, b) => toTime(b.date) - toTime(a.date))
    .slice(0, CARD_LIMIT)
    .map((post) => ({
      id: post.id,
      title: post.title,
      meta: formatYearMonth(post.date),
      href: `/blog/${post.id}`,
      imageUrl: post.thumbnail,
      highlight: formatYearMonth(post.date),
    }));

  return {
    layout: "cards",
    eyebrow: "블로그",
    description: "만들면서 고민하고\n배운 것들",
    total: contentPosts.length,
    items,
    more: { label: "블로그 전체 보기", href: "/blog" },
  };
}

// 이력서 페이지를 캡처한 이미지 한 장을 보여준다 (public/images/landing/resume-preview.png)
function buildResume(): PreviewContent {
  return {
    layout: "paper",
    eyebrow: "이력서",
    description: "한 장으로 정리한\n경험과 성과",
    total: 1,
    items: [
      {
        id: "resume",
        title: "이력서",
        meta: "조성주 · 풀스택 개발자",
        href: "/resume",
        imageUrl: "/images/landing/resume-preview.png",
      },
    ],
    more: { label: "이력서 보기", href: "/resume" },
  };
}

function buildContact(): PreviewContent {
  return {
    layout: "rows",
    eyebrow: "연락하기",
    description: "협업이나 커피챗 모두\n편하게 연락주세요",
    total: 3,
    items: [
      {
        id: "email",
        title: LINK.email,
        meta: "Email",
        href: `mailto:${LINK.email}`,
        highlight: "Email",
        external: true,
      },
      {
        id: "github",
        title: "@iamfiro",
        meta: "GitHub",
        href: LINK.github,
        highlight: "GitHub",
        external: true,
      },
      {
        id: "linkedin",
        title: "Sungju Cho",
        meta: "LinkedIn",
        href: LINK.linkedin,
        highlight: "LinkedIn",
        external: true,
      },
    ],
    more: { label: "연락 페이지로", href: "/contact" },
  };
}

const BUILDERS: Record<PreviewKey, () => PreviewContent> = {
  projects: buildProjects,
  activities: buildActivities,
  blog: buildBlog,
  resume: buildResume,
  contact: buildContact,
};

// 콘텐츠는 빌드 시점에 고정된 정적 데이터라 모듈 로드 시 한 번만 만든다
export const PREVIEW_CONTENT = Object.fromEntries(
  Object.entries(BUILDERS).map(([key, build]) => [key, build()]),
) as Record<PreviewKey, PreviewContent>;
