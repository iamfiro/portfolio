import type { ReactNode } from "react";

import { Box, Heading } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
}

/** 본문 칼럼 폭에 맞춰 제목 아래로 내용을 이어 붙인다 */
export default function ProjectSection({ id, title, children }: Props) {
  return (
    <Box as="section" id={id} className={s.section}>
      <Box className={s.inner}>
        <Reveal>
          <Heading as="h2" className={s.title}>
            {title}
          </Heading>
        </Reveal>

        {children}
      </Box>
    </Box>
  );
}
