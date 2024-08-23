import { omit } from "lodash-es";
import { ClassAttributes, HTMLAttributes } from "react";
import { ExtraProps } from "react-markdown";
import "./mdx.scss";

function CodeView({
  children,
  ...otherProps
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) {
  return (
    <pre {...omit(otherProps, "node")} className={`${otherProps.className}`}>
      <section className="code__tools">
        <span className="bg-red-500 code__circle"></span>
        <span className="bg-yellow-500 code__circle"></span>
        <span className="bg-green-500 code__circle"></span>
      </section>

      {children}
      <div className="pb-1"></div>
    </pre>
  );
}

export default CodeView;
