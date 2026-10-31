import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { type ReactNode, useRef } from "react";

import RollText from "@/feature/landing/components/roll-text";
import { useLandingNavigate } from "@/feature/landing/hooks/use-landing-navigate";
import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Heading, Image, Link } from "@/shared/components/ui";

import s from "./style.module.scss";

// 줄이 하나씩 올라오는 간격(초)
const LINE_STAGGER = 0.12;

interface SectionLink {
  href: string;
  label: string;
}

interface Props {
  titleId: string;
  /** 한 줄씩 마스크 아래에서 올라오는 제목 줄들 */
  lines: string[];
  /** 제목 아래 알약 링크. 없으면 제목만 둔다 */
  link?: SectionLink;
  /** 어두운 배경 위에 놓일 땐 "dark" */
  tone?: "light" | "dark";
  /** 하위 페이지 맨 위 머리로 쓸 땐 "h1" */
  as?: "h1" | "h2";
  /** 첫 줄 왼쪽에 붙는 아이콘(앱 로고 등). 첫 줄과 함께 올라온다 */
  icon?: string | null;
  /** 이 번째 줄부터는 회색 보조 문구로 낮춘다 (예: 이름 아래 한 줄 소개) */
  mutedFrom?: number;
  /** 머리 상자 위에 겹쳐 까는 장식(마스코트 등) */
  children?: ReactNode;
  className?: string;
}

/** 랜딩 섹션의 공용 머리. 제목이 줄 단위로 올라오고 아래에 이동 링크가 붙는다 */
export default function SectionHead({
  titleId,
  lines,
  link,
  tone = "light",
  as = "h2",
  icon,
  mutedFrom,
  children,
  className,
}: Props) {
  const headRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headRef, { once: true, amount: 0.4 });
  // 동작 줄이기 사용자는 재생 없이 완성된 문장을 본다
  const reduceMotion = useReducedMotion();
  const isShown = isInView || !!reduceMotion;
  const handleNavigate = useLandingNavigate();

  const headClassName = [s.head, s[tone], className].filter(Boolean).join(" ");

  return (
    // Box는 ref를 넘기지 않으므로 진입 감지용 ref는 motion.div에 단다
    <motion.div ref={headRef} className={headClassName}>
      <Heading as={as} id={titleId} className={s.headline}>
        {lines.map((line, index) => (
          <Box as="span" key={line} className={s.line}>
            <motion.span
              className={[
                s.lineInner,
                mutedFrom !== undefined && index >= mutedFrom && s.muted,
              ]
                .filter(Boolean)
                .join(" ")}
              initial={{ y: "110%" }}
              animate={isShown ? { y: "0%" } : undefined}
              transition={{
                duration: reduceMotion ? 0 : 1,
                ease: LANDING_EASE,
                delay: reduceMotion ? 0 : index * LINE_STAGGER,
              }}
            >
              {index === 0 && icon && (
                <Image src={icon} alt="" className={s.icon} aria-hidden />
              )}
              {line}
            </motion.span>
          </Box>
        ))}
      </Heading>

      {link && (
        <Link
          href={link.href}
          className={s.all}
          onClick={handleNavigate}
          data-roll-trigger
        >
          <RollText text={link.label} />
          <Box as="span" className={s.allIcon} aria-hidden>
            <ArrowRight size={16} />
          </Box>
        </Link>
      )}

      {children}
    </motion.div>
  );
}
