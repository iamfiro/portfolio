import type { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { Box } from "@/shared/components/ui";

import LandingFooter from "../footer";
import LandingHeader from "../header";
import SectionHead from "../section-head";
import SkipLink, { MAIN_CONTENT_ID } from "../skip-link";

import s from "./style.module.scss";

interface Props {
  titleId: string;
  /** 페이지 머리(h1)로 한 줄씩 올라오는 제목 줄들 */
  lines: string[];
  /** 브라우저 탭 제목. 없으면 페이지가 직접 정한다 */
  documentTitle?: string;
  /** 머리 첫 줄 왼쪽에 붙는 아이콘(앱 로고 등) */
  icon?: string | null;
  /** 이 번째 줄부터 머리를 회색 보조 문구로 낮춘다 */
  mutedFrom?: number;
  children: ReactNode;
  className?: string;
}

/** 하위 페이지 공용 뼈대. 랜딩과 같은 헤더·머리·푸터 사이에 본문을 끼운다 */
export default function PageShell({
  titleId,
  lines,
  documentTitle,
  icon,
  mutedFrom,
  children,
  className,
}: Props) {
  const bodyClassName = [s.body, className].filter(Boolean).join(" ");

  return (
    <Box as="main" className={s.shell}>
      {documentTitle && (
        <Helmet>
          <title>{`${documentTitle} - 조성주`}</title>
        </Helmet>
      )}
      <SkipLink />
      <LandingHeader />
      {/* 건너뛰기 링크가 닿는 곳. 포커스를 받을 수 있게 tabIndex를 둔다 */}
      <Box
        as="section"
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={s.hero}
        aria-labelledby={titleId}
      >
        <SectionHead
          titleId={titleId}
          lines={lines}
          as="h1"
          icon={icon}
          mutedFrom={mutedFrom}
          className={s.head}
        />
      </Box>
      <Box className={bodyClassName}>{children}</Box>
      <LandingFooter />
    </Box>
  );
}
