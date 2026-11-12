import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import CodeBlock from "../code-block";

import "katex/dist/katex.min.css";
import s from "./style.module.scss";

interface Props {
  content: string;
}

export default function MarkdownContent({ content }: Props) {
  return (
    <div className={s.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children);

            // 언어 없는 펜스 블록도 줄바꿈이 있으면 코드 블록으로 렌더링
            if (!match && !code.includes("\n")) {
              return (
                <code className={s.inline_code} {...props}>
                  {children}
                </code>
              );
            }

            return <CodeBlock code={code} language={match?.[1] ?? "text"} />;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          img({ src, alt }) {
            return <img src={src} alt={alt} className={s.image} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
