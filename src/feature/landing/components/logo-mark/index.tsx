import type { HTMLAttributes } from "react";

import { Box, Image } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  src: string;
  size?: "sm" | "md";
}

/** 기관·대회 로고를 그대로 보여 주는 장식용 마크. 옆 글자가 이름을 말해 주므로 alt는 비운다 */
export default function LogoMark({
  src,
  size = "md",
  className,
  ...props
}: Props) {
  const markClassName = [s.mark, s[size], className].filter(Boolean).join(" ");

  return (
    <Box as="span" className={markClassName} aria-hidden {...props}>
      <Image src={src} alt="" objectFit="contain" className={s.image} />
    </Box>
  );
}
