import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Image, Link, Text } from "@/shared/components/ui";

import type { PreviewItem } from "../header-preview.type";

import s from "./style.module.scss";

interface Props {
  item: PreviewItem;
  /** 등장 순서. 왼쪽으로 이동해 왔으면 오른쪽 카드부터 올라온다 */
  order: number;
  /** "more"는 빈 칸을 채우는 전체 보기 타일 */
  variant?: "item" | "more" | "row" | "moreRow";
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const DURATION = 0.7;

export default function PreviewCard({
  item,
  order,
  variant = "item",
  onNavigate,
}: Props) {
  const { title, meta, href, imageUrl, highlight, external } = item;
  const delay = 0.12 + order * 0.06;
  const isMore = variant === "more";
  const isMoreRow = variant === "moreRow";
  const isRow = variant === "row" || isMoreRow;
  const cardClassName = [
    s.card,
    isMore && s.more,
    isRow && s.row,
    isMoreRow && s.moreRow,
  ]
    .filter(Boolean)
    .join(" ");

  if (isRow) {
    return (
      <motion.div
        className={cardClassName}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION, ease: LANDING_EASE, delay }}
      >
        <Link
          href={href}
          external={external}
          className={s.link}
          onClick={external ? undefined : onNavigate}
        >
          <Box as="span" className={s.rowBody}>
            <Text as="span" className={s.title} truncate>
              {title}
            </Text>
            {meta && (
              <Text as="span" className={s.meta} truncate>
                {meta}
              </Text>
            )}
          </Box>
          <Box as="span" className={s.rowArrow} aria-hidden>
            {isMoreRow ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
          </Box>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClassName}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION, ease: LANDING_EASE, delay }}
    >
      <Link
        href={href}
        external={external}
        className={s.link}
        onClick={external ? undefined : onNavigate}
      >
        {/* 아래에서 위로 걷히며 드러나는 미디어 */}
        <motion.div
          className={s.media}
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: DURATION + 0.2, ease: LANDING_EASE, delay }}
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="" className={s.image} />
          ) : (
            <Text as="span" className={s.highlight}>
              {highlight}
            </Text>
          )}
          <Box as="span" className={s.arrow} aria-hidden>
            {isMore ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
          </Box>
        </motion.div>
        {!isMore && (
          <Box className={s.body}>
            <Text as="span" className={s.title} truncate>
              {title}
            </Text>
            {meta && (
              <Text as="span" className={s.meta} truncate>
                {meta}
              </Text>
            )}
          </Box>
        )}
      </Link>
    </motion.div>
  );
}
