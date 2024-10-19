import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { defaultComponents } from "./DefaultComponents";
import "prism-themes/themes/prism-xonokai.min.css";
import "./mdx.scss";
import "./theme/tailwind-blue.dark.css";
import { RangeInFileWithContents } from "core";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({
  language,
  value,
}: {
  language: string;
  value: string;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={copyToClipboard}
        style={{ position: "absolute", right: 0, zIndex: 1 }}
      >
        复制
      </button>
      <SyntaxHighlighter language={language} style={oneDark}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = (
  props: Options & {
    rangeInfo?: RangeInFileWithContents;
  },
) => {
  return (
    <ReactMarkdown
      className="markdown-body mb-4 overflow-hidden"
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
      ]}
      components={{
        ...defaultComponents,
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
      {...props}
    ></ReactMarkdown>
  );
};

export default MarkdownRenderer;
