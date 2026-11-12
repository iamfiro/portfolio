import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { CopyButton, Flex, Text } from "@/shared/components/ui";

import { registerRedisSyntax } from "./redis-syntax.util";

import s from "./style.module.scss";

registerRedisSyntax();

interface Props {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: Props) {
  const trimmed = code.replace(/\n+$/, "");

  return (
    <div className={s.code_block}>
      <Flex align="center" justify="space-between" className={s.head}>
        <Text as="span" size="xs" className={s.language}>
          {language}
        </Text>
        <CopyButton
          text={trimmed}
          size="sm"
          className={s.copy}
          aria-label="코드 복사"
        />
      </Flex>
      <SyntaxHighlighter
        language={language}
        useInlineStyles={false}
        PreTag="div"
        className={s.pre}
      >
        {trimmed}
      </SyntaxHighlighter>
    </div>
  );
}
