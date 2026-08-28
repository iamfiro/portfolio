import { motion } from "framer-motion";
import type { MouseEvent } from "react";

import { useMagnetic } from "@/shared/hooks";

import s from "./Header.module.scss";

interface Props {
  href: string;
  label: string;
  active?: boolean;
  /** 링크 대신 텍스트만 보여줄지 여부 (현재 위치한 페이지) */
  asText?: boolean;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
}

export default function MagneticNavLink({
  href,
  label,
  active = false,
  asText = false,
  onNavigate,
}: Props) {
  const { areaRef, x, y, onPointerMove, onPointerLeave } =
    useMagnetic<HTMLLIElement>();

  const itemClassName = [s.navItem, active ? s.active : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      ref={areaRef}
      className={itemClassName}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {asText ? (
        <motion.span className={s.navLabel} style={{ x, y }}>
          {label}
        </motion.span>
      ) : (
        <motion.a
          href={href}
          className={s.navLabel}
          style={{ x, y }}
          onClick={(e) => onNavigate?.(e, href)}
        >
          {label}
        </motion.a>
      )}
    </li>
  );
}
