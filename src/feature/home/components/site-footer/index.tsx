import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

import { useHomeSectionAnimation } from "@/feature/home/hooks";
import { Footer, Link, Text } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";

import s from "./style.module.scss";

const SOCIAL_LINKS = [
  { href: LINK.github, icon: Github, label: "GitHub" },
  { href: LINK.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: LINK.instagram, icon: Instagram, label: "Instagram" },
  { href: `mailto:${LINK.email}`, icon: Mail, label: "Email" },
] as const;

export default function SiteFooter() {
  const { complete, isVisible, ref } = useHomeSectionAnimation({
    id: "site-footer",
    order: 6,
  });

  return (
    <motion.div ref={ref}>
      <Footer>
        <motion.div
          initial={HOME_ANIMATION_HIDDEN}
          animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
          transition={getHomeAnimationTransition()}
        >
          <Text size="sm" color="subtle">
            &copy; 2025 Cho Sungju
          </Text>
        </motion.div>
        <nav className={s.socialLinks} aria-label="Social links">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }, index) => (
            <motion.div
              key={label}
              initial={HOME_ANIMATION_HIDDEN}
              animate={
                isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN
              }
              transition={getHomeAnimationTransition(index + 1)}
              onAnimationComplete={
                index === SOCIAL_LINKS.length - 1 ? complete : undefined
              }
            >
              <Link
                href={href}
                external
                variant="subtle"
                className={s.socialLink}
                aria-label={label}
              >
                <Icon size={18} />
              </Link>
            </motion.div>
          ))}
        </nav>
      </Footer>
    </motion.div>
  );
}
