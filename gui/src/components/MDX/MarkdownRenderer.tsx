import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import { defaultComponents } from "./DefaultComponents";
import "prism-themes/themes/prism-xonokai.min.css";
import "./mdx.scss";
import "./theme/tailwind-blue.dark.css";
import { RangeInFileWithContents } from "core";
import CodeView from "./CodeView";

const MarkdownRenderer = (
  props: Options & {
    rangeInfo?: RangeInFileWithContents;
  },
) => {
  return (
    <ReactMarkdown
      className="markdown-body mb-4 overflow-hidden"
      rehypePlugins={[rehypeKatex, rehypePrism]}
      remarkPlugins={[
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
      ]}
      components={{
        ...defaultComponents,
        pre: (...p) => <CodeView rangeInfo={props.rangeInfo} {...p[0]} />,
      }}
      {...props}
    ></ReactMarkdown>
  );
};

export default MarkdownRenderer;
