import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import { defaultComponents } from "./DefaultComponents";
import "prism-themes/themes/prism-xonokai.min.css";
import "./theme/tailwind-blue.css";

const MarkdownRenderer = (props: Options) => {
  return (
    <ReactMarkdown
      className="markdown-body px-4"
      rehypePlugins={[rehypeKatex, rehypePrism]}
      remarkPlugins={[
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
      ]}
      components={defaultComponents}
      {...props}
    ></ReactMarkdown>
  );
};

export default MarkdownRenderer;
