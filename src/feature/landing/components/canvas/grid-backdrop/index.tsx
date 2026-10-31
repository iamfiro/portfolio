import { Box } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  variant?: "lines" | "dots";
  className?: string;
}

/** 섹션 뒤에 까는 디자인 툴 캔버스 격자. 가장자리로 갈수록 옅어진다 */
export default function GridBackdrop({ variant = "lines", className }: Props) {
  const backdropClassName = [s.backdrop, s[variant], className]
    .filter(Boolean)
    .join(" ");

  return <Box className={backdropClassName} aria-hidden />;
}
