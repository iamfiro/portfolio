import type { HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

import { Image } from "../Image/Image";
import { Link } from "../Link/Link";

import s from "./style.module.scss";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("jsx", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("tsx", typescript);

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: string;
  variant?: "article" | "compact";
}

export default function MarkdownContent({
  content,
  variant = "article",
  className,
  ...props
}: Props) {
  const componentClassName = [s.markdown, s[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={componentClassName} {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            const external = /^https?:\/\//i.test(href ?? "");

            return (
              <Link href={href} external={external} variant="brand">
                {children}
              </Link>
            );
          },
          code({ className: codeClassName, children, ...codeProps }) {
            const match = /language-(\w+)/.exec(codeClassName || "");

            if (!match) {
              return (
                <code className={s.inlineCode} {...codeProps}>
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className={s.codeBlock}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          img({ src, alt }) {
            if (!src) return null;

            return <Image src={src} alt={alt ?? ""} className={s.image} responsive />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
