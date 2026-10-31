import type { FocusEvent, MouseEvent, ReactNode } from "react";

import RollText from "@/feature/landing/components/roll-text";
import { Box, Link } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  /** 미리보기 패널이 이 링크에 붙어 열려 있는지 */
  isActive?: boolean;
  /** 지금 보고 있는 페이지의 링크인지. 스크린리더에 현재 위치로 알린다 */
  isCurrent?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void;
}

export default function HeaderLink({
  href,
  label,
  icon,
  className,
  isActive = false,
  isCurrent = false,
  onClick,
  onMouseEnter,
  onFocus,
}: Props) {
  const linkClassName = [s.link, isActive && s.active, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      className={linkClassName}
      aria-current={isCurrent ? "page" : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
    >
      <RollText text={label} active={isActive} />
      {icon && (
        <Box as="span" className={s.icon} aria-hidden>
          {icon}
        </Box>
      )}
    </Link>
  );
}
