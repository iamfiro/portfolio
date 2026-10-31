import { ArrowRight } from "lucide-react";
import type { FocusEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useBackdropTone } from "@/feature/landing/hooks/use-backdrop-tone";
import { usePageTransition } from "@/shared/components/layouts";
import { Box, Grid, Image, Link } from "@/shared/components/ui";
import { contentProjects } from "@/shared/content/content";
import { useMediaQuery } from "@/shared/hooks";

import type { IndicatorRect } from "./header-indicator/header-indicator.type";
import type { PreviewKey } from "./header-preview/header-preview.type";
import HeaderIndicator from "./header-indicator";
import HeaderLink from "./header-link";
import HeaderPreview from "./header-preview";

import s from "./style.module.scss";

const NAV_ITEMS = [
  { key: "activities", path: "/activities", label: "활동" },
  { key: "blog", path: "/blog", label: "블로그" },
  { key: "resume", path: "/resume", label: "이력서" },
] as const;

const CLOSE_DELAY = 150;

interface ActiveLink {
  key: PreviewKey;
  rect: IndicatorRect;
}

interface Props {
  /** 없으면 콘텐츠의 전체 프로젝트 수를 쓴다 */
  projectCount?: number;
}

export default function LandingHeader({
  projectCount = contentProjects.length,
}: Props) {
  const { navigateTo } = usePageTransition();
  const { pathname } = useLocation();
  const isCurrent = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);
  const tone = useBackdropTone();
  const canHover = useMediaQuery("(hover: hover)");

  const [active, setActive] = useState<ActiveLink | null>(null);
  const preview = active?.key ?? null;
  const closeTimer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!preview) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preview]);

  // 링크 박스 영역을 헤더 기준 좌표로 재서 인디케이터가 그 자리로 옮겨 가게 한다
  const openPreview =
    (key: PreviewKey) =>
    ({ currentTarget }: { currentTarget: HTMLAnchorElement }) => {
      if (!canHover) return;
      window.clearTimeout(closeTimer.current);

      const header = currentTarget.closest("header");
      if (!header) return;
      const link = currentTarget.getBoundingClientRect();
      const bounds = header.getBoundingClientRect();

      setActive({
        key,
        rect: {
          x: link.left - bounds.left,
          y: link.top - bounds.top,
          width: link.width,
          height: link.height,
        },
      });
    };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), CLOSE_DELAY);
  };

  // 포커스가 헤더(패널 포함) 밖으로 나가면 닫는다
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
  };

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActive(null);
    navigateTo(event.currentTarget.getAttribute("href") ?? "/");
  };

  return (
    <Box
      as="header"
      className={[s.header, s[tone], preview && s.open]
        .filter(Boolean)
        .join(" ")}
      onMouseLeave={scheduleClose}
      onBlur={handleBlur}
    >
      <HeaderIndicator rect={active?.rect ?? null} />
      <Grid className={s.grid}>
        <Link
          href="/"
          className={s.logo}
          onClick={handleNavigate}
          onMouseEnter={scheduleClose}
        >
          <Image src="/logo.svg" alt="조성주" objectFit="contain" />
        </Link>
        <HeaderLink
          href="/projects"
          label={`프로젝트 (${projectCount})`}
          className={s.work}
          isActive={preview === "projects"}
          isCurrent={isCurrent("/projects")}
          onClick={handleNavigate}
          onMouseEnter={openPreview("projects")}
          onFocus={openPreview("projects")}
        />
        <Box as="nav" className={s.nav} aria-label="주요 메뉴">
          {NAV_ITEMS.map(({ key, path, label }) => (
            <HeaderLink
              key={path}
              href={path}
              label={label}
              isActive={preview === key}
              isCurrent={isCurrent(path)}
              onClick={handleNavigate}
              onMouseEnter={openPreview(key)}
              onFocus={openPreview(key)}
            />
          ))}
        </Box>
        <HeaderLink
          href="/contact"
          label="연락하기"
          icon={<ArrowRight size={16} />}
          className={s.contact}
          isActive={preview === "contact"}
          isCurrent={isCurrent("/contact")}
          onClick={handleNavigate}
          onMouseEnter={openPreview("contact")}
          onFocus={openPreview("contact")}
        />
      </Grid>
      <HeaderPreview activeKey={preview} onNavigate={handleNavigate} />
    </Box>
  );
}
