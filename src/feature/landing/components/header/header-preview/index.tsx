import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";

import RollText from "@/feature/landing/components/roll-text";
import { useElementHeight } from "@/feature/landing/hooks/use-element-height";
import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Grid, Link, Text } from "@/shared/components/ui";

import type { PreviewItem, PreviewKey } from "./header-preview.type";
import { CARD_LIMIT, PREVIEW_CONTENT } from "./header-preview.util";
import PreviewCard from "./preview-card";
import PreviewPaper from "./preview-paper";

import s from "./style.module.scss";

/** 헤더에 놓인 링크 순서. 전환 방향을 정하는 기준이다. */
const PREVIEW_ORDER: PreviewKey[] = [
  "projects",
  "activities",
  "blog",
  "resume",
  "contact",
];

const CLIP_OPEN = "inset(0% 0% 0% 0%)";
const CLIP_CLOSED = "inset(0% 0% 100% 0%)";
const SHIFT = 48;

// 오른쪽 링크로 가면 내용이 오른쪽에서 들어오고 왼쪽으로 빠진다
const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * SHIFT }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -SHIFT }),
};

interface Props {
  activeKey: PreviewKey | null;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function HeaderPreview({ activeKey, onNavigate }: Props) {
  const [measureRef, height] = useElementHeight<HTMLDivElement>();
  const [tracked, setTracked] = useState({ key: activeKey, direction: 0 });

  // 렌더 중에 이전 키와 비교해 방향을 갱신한다 (effect를 거치면 한 프레임 늦는다)
  if (tracked.key !== activeKey) {
    const from = tracked.key ? PREVIEW_ORDER.indexOf(tracked.key) : -1;
    const to = activeKey ? PREVIEW_ORDER.indexOf(activeKey) : -1;
    const direction = from < 0 || to < 0 ? 0 : Math.sign(to - from);
    setTracked({ key: activeKey, direction });
  }

  const { direction } = tracked;
  const content = activeKey ? PREVIEW_CONTENT[activeKey] : null;

  const isRows = content?.layout === "rows";
  const isPaper = content?.layout === "paper";
  // 한도를 넘으면 마지막 칸을 전체 보기 타일로 바꿔 더 있음을 알린다
  const overflow = !!content && content.total > CARD_LIMIT;
  const visibleItems = content
    ? overflow
      ? content.items.slice(0, CARD_LIMIT - 1)
      : content.items
    : [];
  const showMore =
    !!content &&
    !isPaper &&
    (overflow || (!isRows && content.items.length < CARD_LIMIT));
  const moreItem: PreviewItem | null =
    content && showMore
      ? {
          id: "more",
          title: content.more.label,
          meta: "",
          href: content.more.href,
          highlight: "전체 보기",
        }
      : null;
  const cardCount = visibleItems.length + (moreItem ? 1 : 0);
  const orderOf = (index: number) =>
    direction < 0 ? cardCount - 1 - index : index;

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          key="backdrop"
          className={s.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
      {content && (
        <motion.div
          key="panel"
          className={s.panel}
          initial={{ clipPath: CLIP_CLOSED }}
          animate={{ clipPath: CLIP_OPEN, height: height || "auto" }}
          exit={{ clipPath: CLIP_CLOSED }}
          transition={{ duration: 0.7, ease: LANDING_EASE }}
        >
          <motion.div ref={measureRef} className={s.measure}>
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                key={activeKey}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: LANDING_EASE }}
              >
                <Grid className={s.content}>
                  <Box className={s.aside}>
                    <Box>
                      <Text as="div" className={s.description}>
                        {content.description.split("\n").map((line, index) => (
                          <Box as="span" key={line} className={s.lineMask}>
                            <motion.span
                              className={s.line}
                              initial={{ y: "110%" }}
                              animate={{ y: "0%" }}
                              transition={{
                                duration: 0.8,
                                ease: LANDING_EASE,
                                delay: 0.05 + index * 0.07,
                              }}
                            >
                              {line}
                            </motion.span>
                          </Box>
                        ))}
                      </Text>
                    </Box>
                    <Link
                      href={content.more.href}
                      className={s.more}
                      onClick={onNavigate}
                      data-roll-trigger
                    >
                      <RollText text={content.more.label} />
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  </Box>
                  {isPaper ? (
                    <PreviewPaper
                      item={visibleItems[0]}
                      onNavigate={onNavigate}
                    />
                  ) : (
                    <Box className={isRows ? s.rows : s.cards}>
                      {visibleItems.map((item, index) => (
                        <PreviewCard
                          key={item.id}
                          item={item}
                          order={orderOf(index)}
                          variant={isRows ? "row" : "item"}
                          onNavigate={onNavigate}
                        />
                      ))}
                      {moreItem && (
                        <PreviewCard
                          item={moreItem}
                          order={orderOf(cardCount - 1)}
                          variant={isRows ? "moreRow" : "more"}
                          onNavigate={onNavigate}
                        />
                      )}
                    </Box>
                  )}
                </Grid>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
