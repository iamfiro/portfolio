import MarkdownContent from "@/feature/blog/components/markdown-content";
import { Box } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  content: string;
}

/** 프로젝트 마크다운 본문을 블로그 글과 같은 읽기 스타일로 펼친다 */
export default function ProjectBody({ content }: Props) {
  return (
    <Box as="section" id="article" className={s.body}>
      <Reveal className={s.inner}>
        <MarkdownContent content={content} />
      </Reveal>
    </Box>
  );
}
