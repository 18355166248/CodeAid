import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import { defaultComponents } from "./DefaultComponents";
import "prism-themes/themes/prism-xonokai.min.css";
import "./theme/tailwind-blue.dark.css";

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
      // components={{
      //   code({ className, children, ...props }) {
      //     console.log("🚀 ~ code ~ className:", className);
      //     const match = /language-(\w+)/.exec(className || "");
      //     return match ? (
      //       <SyntaxHighlighter
      //         language={match[1]}
      //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //         // @ts-expect-error
      //         style={darcula}
      //         {...props}
      //       >
      //         {String(children).replace(/\n$/, "")}
      //       </SyntaxHighlighter>
      //     ) : (
      //       <code className={className} {...props}>
      //         {children}
      //       </code>
      //     );
      //   },
      // }}
    ></ReactMarkdown>
  );
};

export default MarkdownRenderer;
