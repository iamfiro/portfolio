import type { ReactNode } from "react";

import { Box } from "@/shared/components/ui";

import s from "./style.module.scss";

const HANDLES = ["tl", "tc", "tr", "bl", "bc", "br"] as const;

interface Props {
  children: ReactNode;
  /** 켜면 텍스트를 드래그로 선택한 것처럼 면을 깐다 */
  highlighted?: boolean;
  className?: string;
}

/** 디자인 툴에서 레이어를 선택했을 때의 점선 테두리 + 크기 조절 핸들 */
export default function SelectionFrame({
  children,
  highlighted = false,
  className,
}: Props) {
  const frameClassName = [s.frame, highlighted && s.highlighted, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Box as="span" className={frameClassName}>
      {children}
      <Box as="span" className={s.border} aria-hidden>
        {HANDLES.map((handle) => (
          <Box as="span" key={handle} className={`${s.handle} ${s[handle]}`} />
        ))}
      </Box>
    </Box>
  );
}
