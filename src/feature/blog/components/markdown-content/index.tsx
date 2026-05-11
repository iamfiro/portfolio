import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import s from "./style.module.scss";

interface Props {
  content: string;
}

export default function MarkdownContent({ content }: Props) {
  return (
    <div className={s.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code className={s.inline_code} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className={s.code_block}
                customStyle={{
                  padding: "20px 24px",
                  background: "transparent",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
                codeTagProps={{
                  style: {
                    fontFamily:
                      '"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
                  },
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
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
