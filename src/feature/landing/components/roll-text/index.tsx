import type { CSSProperties } from "react";

import { Box, VisuallyHidden } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  text: string;
  /** 켜져 있으면 굴린 상태를 유지한다. 꺼져 있어도 `data-roll-trigger` 조상에 호버하면 굴러간다 */
  active?: boolean;
  className?: string;
}

/**
 * 글자마다 정육면체를 세워, 앞면이 위로 넘어가며 아랫면이 올라오게 굴린다.
 * 앞/아랫면 색은 부모가 `--roll-from` / `--roll-to`로 정한다.
 */
export default function RollText({ text, active = false, className }: Props) {
  const rollClassName = [s.roll, active && s.active, className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <VisuallyHidden>{text}</VisuallyHidden>
      <Box as="span" className={rollClassName} aria-hidden>
        {[...text].map((char, index) => (
          <Box
            as="span"
            key={index}
            className={s.cube}
            style={{ "--i": index } as CSSProperties}
          >
            <Box as="span" className={s.front}>
              {char}
            </Box>
            <Box as="span" className={s.bottom}>
              {char}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
