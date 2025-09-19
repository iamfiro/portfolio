import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rehypeRaw from "rehype-raw";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          if (language) {
            return (
              <SyntaxHighlighter
                language={language}
                PreTag="pre"
                CodeTag="code"
                className="github-code-block"
                showLineNumbers={true}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }

          return (
            <code
              className={className}
              {...props}
              style={{
                fontFamily:
                  "'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace",
                fontSize: "85%",
                padding: "0.2em 0.4em",
                backgroundColor: "rgba(175,184,193,0.2)",
                borderRadius: "6px",
              }}
            >
              {children}
            </code>
          );
        },
        strong({ children, ...props }) {
          return <strong {...props}>{children}</strong>;
        },
        em({ children, ...props }) {
          return <em {...props}>{children}</em>;
        },
      }}
    >
      {children}
    </Markdown>
  );
}
