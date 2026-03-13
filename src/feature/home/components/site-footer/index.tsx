import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Footer, Text, Link } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import s from "./style.module.scss";

const SOCIAL_LINKS = [
  { href: LINK.github, icon: Github, label: "GitHub" },
  { href: LINK.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: LINK.instagram, icon: Instagram, label: "Instagram" },
  { href: `mailto:${LINK.email}`, icon: Mail, label: "Email" },
] as const;

export default function SiteFooter() {
  return (
    <Footer>
      <Text size="sm" color="subtle">
        &copy; 2025 Cho Sungju
      </Text>
      <nav className={s.socialLinks} aria-label="Social links">
        {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            external
            variant="subtle"
            className={s.socialLink}
            aria-label={label}
          >
            <Icon size={18} />
          </Link>
        ))}
      </nav>
    </Footer>
  );
}
