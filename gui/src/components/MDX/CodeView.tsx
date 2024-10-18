import { RangeInFileWithContents } from "core";
import { omit } from "lodash-es";
import { ClassAttributes, HTMLAttributes } from "react";
import { ExtraProps } from "react-markdown";

function CodeView({
  children,
  rangeInfo,
  ...otherProps
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps & {
    rangeInfo?: RangeInFileWithContents;
  }) {
  function useCode() {
    console.log("rangeInfo", rangeInfo);
  }
  return (
    <pre {...omit(otherProps, "node")} className={`${otherProps.className}`}>
      {rangeInfo ? (
        <div
          className="flex justify-between px-4 py-2 text-base border-b border-gray-500"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <div></div>
          <div>
            <span className="text-gray-400 cursor-pointer mr-2">复制</span>
            <span className="text-gray-400 cursor-pointer" onClick={useCode}>
              采纳
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      {children}
    </pre>
  );
}

export default CodeView;
