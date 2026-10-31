import type { ReactNode } from "react";

import { Box, Heading, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  id: string;
  title: string;
  paragraphs: string[];
  children?: ReactNode;
}

/** 블로그 글의 한 단락처럼 제목 아래로 문단과 블록을 이어 붙인다 */
export default function CaseStudySection({
  id,
  title,
  paragraphs,
  children,
}: Props) {
  return (
    <Box as="section" id={id} className={s.section}>
      <Box className={s.inner}>
        <Reveal>
          <Heading as="h2" className={s.title}>
            {title}
          </Heading>
        </Reveal>

        <Box className={s.body}>
          {paragraphs.length > 0 && (
            <Reveal index={1} className={s.paragraphs}>
              {paragraphs.map((paragraph) => (
                <Text key={paragraph} as="p" className={s.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Reveal>
          )}

          {children}
        </Box>
      </Box>
    </Box>
  );
}
