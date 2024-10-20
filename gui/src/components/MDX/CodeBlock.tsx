import { message } from "antd";
import { RangeInFileWithContents } from "core";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({
  language,
  value,
  rangeInfo,
}: {
  language: string;
  value: string;
  rangeInfo?: RangeInFileWithContents;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    message.success("复制成功");
  };
  const useCode = () => {
    console.log("use code", rangeInfo);
  };

  return (
    <div>
      {rangeInfo ? (
        <div
          className="flex justify-between px-4 py-2 text-sm border-b border-gray-600"
          style={{ backgroundColor: "rgb(40, 44, 52)" }}
        >
          <div></div>
          <div>
            <span
              className="text-gray-400 cursor-pointer mr-4"
              onClick={copyToClipboard}
            >
              复制
            </span>
            <span className="text-gray-400 cursor-pointer" onClick={useCode}>
              采纳
            </span>
          </div>
        </div>
      ) : null}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ marginTop: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeBlock;
