import { MousePointer2 } from "lucide-react";

import { Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

export type CursorTone = "brand" | "info" | "success" | "warning" | "danger";

interface Props {
  label: string;
  tone?: CursorTone;
  className?: string;
}

/** 디자인 툴의 공동 작업자 커서: 화살표 + 이름표 */
export default function CursorTag({ label, tone = "brand", className }: Props) {
  const tagClassName = [s.tag, s[tone], className].filter(Boolean).join(" ");

  return (
    <Box as="span" className={tagClassName} aria-hidden>
      <MousePointer2 className={s.pointer} />
      <Text as="span" className={s.label}>
        {label}
      </Text>
    </Box>
  );
}
