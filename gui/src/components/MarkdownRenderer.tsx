import ReactMarkdown, { Options } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = (props: Options) => {
  return (
    <ReactMarkdown
      {...props}
      components={{
        code({ className, children, ...props }) {
          console.log("🚀 ~ code ~ className:", className);
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              language={match[1]}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              style={darcula}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    ></ReactMarkdown>
  );
};

export default MarkdownRenderer;
