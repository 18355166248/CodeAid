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
import CodeBlock from "./CodeBlock";

const MarkdownRenderer = (
  props: Options & {
    rangeInfo?: RangeInFileWithContents;
  },
) => {
  return (
    <ReactMarkdown
      className="markdown-body mt-2 mb-4 overflow-hidden"
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
      ]}
      components={{
        ...defaultComponents,
        code(_props) {
          const { children, className, ...rest } = _props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              rangeInfo={props.rangeInfo}
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
