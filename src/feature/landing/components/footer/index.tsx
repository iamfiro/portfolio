import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useLandingNavigate } from "@/feature/landing/hooks/use-landing-navigate";
import {
  getRevealProps,
  LANDING_EASE,
} from "@/feature/landing/utils/reveal.util";
import { Box, Link, Text } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import { FOOTER_LINK_GROUPS } from "./footer.util";
import FooterCrowd from "./footer-crowd";
import PixelLogo from "./pixel-logo";

import s from "./style.module.scss";

/** 어두운 톤으로 뒤집혀 끝맺는 푸터. 이메일·링크 아래로 픽셀 워드마크가 모여들고, 맨 아래로 스마일들이 고개를 내민다 */
export default function LandingFooter() {
  const handleNavigate = useLandingNavigate();

  return (
    <Box as="footer" className={s.footer} data-trail-end>
      <Box className={s.inner}>
        <motion.div className={s.links} {...getRevealProps()}>
          <Link href={`mailto:${LINK.email}`} external className={s.email}>
            <Text as="span" className={s.emailText}>
              {LINK.email}
            </Text>
            <Box as="span" className={s.emailIcon} aria-hidden>
              <ArrowUpRight size={24} />
            </Box>
          </Link>

          <Box className={s.groups}>
            {FOOTER_LINK_GROUPS.map((group) => (
              <Box
                as="nav"
                key={group.label}
                className={s.group}
                aria-label={group.label}
              >
                <Text as="span" className={s.groupLabel}>
                  {group.label}
                </Text>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    external={link.external}
                    className={s.link}
                    onClick={link.external ? undefined : handleNavigate}
                  >
                    <Text as="span" className={s.linkText}>
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* 페이지 맨 끝이라 뷰포트 여백 없이 보이자마자 떠오른다 */}
        <motion.div
          className={s.wordmark}
          initial={{ opacity: 0, y: "30%" }}
          whileInView={{ opacity: 1, y: "0%" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: LANDING_EASE }}
        >
          <PixelLogo src="/logo.svg" />
        </motion.div>
      </Box>

      <FooterCrowd />
    </Box>
  );
}
