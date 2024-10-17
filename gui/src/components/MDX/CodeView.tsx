import { omit } from "lodash-es";
import { ClassAttributes, HTMLAttributes } from "react";
import { ExtraProps } from "react-markdown";

function CodeView({
  children,
  ...otherProps
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) {
  return (
    <pre {...omit(otherProps, "node")} className={`${otherProps.className}`}>
      {/* <section className="code__tools">
        <span className="bg-red-500 code__circle"></span>
        <span className="bg-yellow-500 code__circle"></span>
        <span className="bg-green-500 code__circle"></span>
      </section> */}
      <div
        className="flex justify-between px-4 py-2 text-base border-b border-gray-500"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div></div>
        <div>
          <span className="text-gray-400 cursor-pointer mr-2">复制</span>
          <span className="text-gray-400 cursor-pointer">采纳</span>
        </div>
      </div>

      {children}
    </pre>
  );
}

export default CodeView;
