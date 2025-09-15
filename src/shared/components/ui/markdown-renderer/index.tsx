import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CODE_HIGHLIGHT_STYLE = oneLight;

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <Markdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          if (language) {
            return (
              <SyntaxHighlighter
                style={CODE_HIGHLIGHT_STYLE}
                language={language}
                PreTag="div"
                className="code-block"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
