import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Link, Text } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import type { MobileMenuItem } from "./mobile-menu.type";

import s from "./style.module.scss";

const CLIP_OPEN = "inset(0% 0% 0% 0%)";
const CLIP_CLOSED = "inset(0% 0% 100% 0%)";
const PANEL_TRANSITION = { duration: 0.5, ease: LANDING_EASE };

const SOCIAL_LINKS = [
  { label: "GitHub", href: LINK.github },
  { label: "LinkedIn", href: LINK.linkedin },
] as const;

interface Props {
  id: string;
  isOpen: boolean;
  items: MobileMenuItem[];
  isCurrent: (path: string) => boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/** 좁은 화면에서 헤더 아래로 화면을 덮으며 내려오는 메뉴. 큰 링크가 한 줄씩 밀려 올라온다 */
export default function MobileMenu({
  id,
  isOpen,
  items,
  isCurrent,
  onNavigate,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          className={s.panel}
          initial={{ clipPath: CLIP_CLOSED }}
          animate={{ clipPath: CLIP_OPEN }}
          exit={{ clipPath: CLIP_CLOSED }}
          transition={PANEL_TRANSITION}
        >
          <Box as="nav" className={s.list} aria-label="모바일 메뉴">
            {items.map(({ path, label, count }, index) => {
              const current = isCurrent(path);

              return (
                <Box key={path} className={s.item}>
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: LANDING_EASE,
                      delay: 0.12 + index * 0.05,
                    }}
                  >
                    <Link
                      href={path}
                      className={[s.link, current && s.current]
                        .filter(Boolean)
                        .join(" ")}
                      aria-current={current ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      <Text as="span" className={s.label}>
                        {label}
                      </Text>
                      {count !== undefined && (
                        <Text as="span" className={s.count}>
                          {count}
                        </Text>
                      )}
                    </Link>
                  </motion.div>
                </Box>
              );
            })}
          </Box>

          <motion.div
            className={s.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Link href={`mailto:${LINK.email}`} external className={s.email}>
              <Text as="span" className={s.emailText}>
                {LINK.email}
              </Text>
              <Box as="span" className={s.emailIcon} aria-hidden>
                <ArrowUpRight size={18} />
              </Box>
            </Link>
            <Box className={s.socials}>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} external className={s.social}>
                  <Text as="span" className={s.socialText}>
                    {label}
                  </Text>
                </Link>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
